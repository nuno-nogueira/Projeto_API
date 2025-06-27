<template>
	<div>
		<h2>Guia de Recolha NGID0{{ guide?.collection_guide_id }}</h2> 
		<!-- or <h2 v-if="guide">Guia de Recolha NGID0{{ guide.collection_guide_id }}</h2> -->
		 <!-- Without "?" Vue could try to access guide.collection_guide_id before it is uploaded and it would give an error. With "guide?.collection_guide_id", it only tries to access the guide when it is already defined -->
		<!-- <p class="subtitle"><strong>Estado:</strong> {{ guide?.collection_status }}</p> -->
		<p class="subtitle"><strong>Estado:</strong> {{ collStatus }}</p>
		<p class="subtitle"><strong>Rota:</strong> {{ guide?.route_id }}</p>


		<div v-if="guide">
			<div v-for="(point, i) in guide.route.collection_points" :key="i" class="collection-point">
				<v-timeline side="end">
					<v-timeline-item
						v-for="container in filteredContainers(point.containers)" 
						:key="container.container_id"
						:dot-color="'#4CAF50'"
						size="small"
						class="custom-timeline-item"
					>
						<div class="cont-timeline">
							<div>
								<p><strong>Morada:</strong></p>
								<p>{{ point.street_name }}</p>
							</div>
							
							<div>
								<p><strong>Depósito:</strong></p>
								<p>{{ point.collection_point_type }}</p>
							</div>
							
							<div>
								<p><strong>Resíduo:</strong></p>
								<p>{{ container.waste_type.name }}</p>
							</div>
							
							<div class="weight-collected">
								<v-text-field
									v-model="guideChanges[container.container_id].weight"
									type="number"
									label="Peso recolhido (kg)"
									min="0"
									dense
								/> 

							</div>
							<v-checkbox
								v-model="guideChanges[container.container_id].status"
								label="Recolha confirmada"
								@change="checkGuideStatus"
							/>	
							
						</div>
						<v-textarea
								v-model="guideChanges[container.container_id].feedback"
								label="Reportar ocorrências"
								rows="1"
								auto-grow
						/>
						<v-btn @click="saveContainerData(container.container_id)" color="lightgreen">
							Guardar Alterações
						</v-btn>
					</v-timeline-item>
				</v-timeline>
			</div>
		</div> 
	</div>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			guide: { // Save the backend response: collection-guide -> route -> collection-point
				route: {
					collection_points: [] 
				}
			}, 
			containers: [],
			guideChanges: {}, // Where the values from backend are going to be inserted but also where the new values are being stored
			selectedWasteType: '', // Save the type of waste selected by the user
			collStatus: ''
		}
	},

	methods: {
		filteredContainers(containers, guide) {
			if (!this.selectedWasteType && !guide) return containers;

			let filtered = containers;

			if (this.selectedWasteType) {
				const filtro = this.selectedWasteType.trim().toLowerCase();
				filtered = filtered.filter(container =>
				container.waste_type.name.trim().toLowerCase() === filtro
				);
			}

			if (guide) {
				filtered = filtered.filter(container =>
				container.collection_guide_id === guide.collection_guide_id
				);
			}

			return filtered;
		},


		// This function fetches the guide and the rfid readings data:
		async fetchGuide() {
			try {
				const guideID = this.$route.params.id; // Access the id parameter through the parameters defined in the route path -> /guide/:id

				const token = localStorage.getItem('token');

				if (!token) {
					throw new Error('Token não encontrado. Faça login primeiro!');
				}

				// Get the guide data from the backend
				const guideResponse = await axios.get(`http://localhost:3000/collection-guides/${guideID}`, {
					headers: {
					Authorization: `Bearer ${token}`
					},
				}); 
				this.guide = guideResponse.data; // Save the guide data to the component's state
				// console.log('Guide:', this.guide);
				// Get the existing data from the backend and insert it into guideChanges (the fields or initialize them)
				this.guide.route.collection_points.forEach(point => { 
					point.containers = point.containers || [];
					point.containers.forEach(container => {
						if (!this.guideChanges[container.container_id]) {
							this.guideChanges[container.container_id] = {
								weight: 0,
								status: false,
								feedback: '',
								readingID: null
							};
						}
					});
				});

				// Return the readings data for the guide which includes the "weight_collected" and the "rfid_reading_id":
				const readingsResponse = await axios.get(`http://localhost:3000/readings/collection-guides/${guideID}`, {
					headers: {Authorization:`Bearer ${token}`}
					}
				); 
				// This data will be used to update the guideChanges object with the current weight and reading ID for each container
				readingsResponse.data.forEach(reading => {
					if (this.guideChanges[reading.container_id]) {
						this.guideChanges[reading.container_id].weight = reading.weight_collected || 0;
						this.guideChanges[reading.container_id].status = Boolean(reading.collection_status);
						this.guideChanges[reading.container_id].readingID = reading.rfid_reading_id;
					}
				});
				this.checkGuideStatus();

			} catch (error) {
				console.error('Erro ao carregar guia:', error);
			}
		},

		// This function saves the data for a specific container
		async saveContainerData(container_id) {
			const change = this.guideChanges[container_id];
			if (!change) return;

			try {
				const token = localStorage.getItem('token');

				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					}
				}

				if (change.readingID) {
					await axios.patch(`http://localhost:3000/readings/${change.readingID}`, {
						weight_collected: change.weight,
						collection_status: change.status ? 1 : 0,
						feedback: change.feedback
					}, config);
				} else {
					const response = await axios.post('http://localhost:3000/readings', {
						container_id: container_id,
						collection_guide_id: this.guide.collection_guide_id,
						reading_date: new Date().toISOString(),
						weight_collected: change.weight,
						collection_status: change.status ? 1 : 0,
						feedback: change.feedback
					}, config);

					this.guideChanges[container_id].readingID = response.data.rfid_reading_id;
				}
				
				//Save feedback
				if (change.feedback && change.feedback.trim() !== '') {
					const container = this.guide.route.collection_points
						.flatMap(cp => cp.containers)
						.find(c => c.container_id === container_id);


					if (!container) {
						console.warn(`Container with ID ${container_id} not found.`);
						return
					}

					let collectionPointId = null;

					for (const cp of this.guide.route.collection_points) {
						const found = cp.containers.find(c => c.container_id === container_id);
						if (found) {
							collectionPointId = cp.collection_point_id;
							break
						}
					}

					const userId = localStorage.getItem('userId');

					console.log('container:', container);
					console.log('collection_point_id:', collectionPointId);
					console.log('user_id:', userId);

					if (!userId) {
						console.warn('User not found in localStorage.');
						return;
					}

					if (!collectionPointId) {
						console.warn('Collection point ID not found in container.');
						return;
					}

					const feedbackData = {
						description: change.feedback,
						feedback_type: 'recolha',
						collection_point_id: collectionPointId,
						user_id: userId,
						feedback_date: new Date().toISOString()
					};

					await axios.post('http://localhost:3000/feedbacks', feedbackData, config);
				}


				alert('Dados guardados com sucesso.');
			} catch (err) {
				console.error('Erro ao guardar dados:', err);
				if (err.response) {
					console.error('Detalhes do erro:', err.response.data);
				}
			}
		},

		async updateGuideStatus(newStatus) {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.patch(`http://localhost:3000/collection-guides/${this.guide.collection_guide_id}`, 
					{
						collection_status: newStatus
					},
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);				
				this.guide.collection_status = response.data.collection_status; 
				console.log('Status guia atualizado para:', newStatus);
			} catch (error) {
				console.error('Erro ao atualizar o status da guia:', error);
			}
		},

		async checkIfGuideIsCompleted() {
			const currentWasteId = this.guide.waste_id;

			const relevantContainers = [];
			this.guide.route.collection_points.forEach(point => {
				point.containers.forEach(container => {
				if (container.waste_type.id === currentWasteId) {
					relevantContainers.push(container);
				}
				});
			});

			console.log('Relevant containers:', relevantContainers);

			const completed = relevantContainers.filter(container => {
				const status = this.guideChanges[container.container_id]?.status;
				return status === true || status === 'true' || Number(status) === 1;
			}).length;

			const total = relevantContainers.length;

			console.log('Completed:', completed, 'of', total);

			let newStatus = 'não iniciada';
			if (completed === total && total > 0) {
				newStatus = 'concluída';
			} else if (completed > 0) {
				newStatus = 'em execução';
			}

			if (this.guide.collection_status !== newStatus) {
				try {
				await this.updateGuideStatus(newStatus);
				} catch (error) {
				console.error(error);
				}
			}
		},
  
		checkGuideStatus() {
		const total = Object.keys(this.guideChanges).length;
		if (total === 0) {
			this.collStatus = 'não iniciada';
			return
		}

		let marked = 0;
		Object.values(this.guideChanges).forEach(change => {
			if (change.status) {
				marked++;
			}
		});

		if (marked === 0) {
			this.collStatus = 'não iniciada';
		} else if (marked === total) {
			this.collStatus = 'concluída';
		} else {
			this.collStatus = 'em execução';
		}
	},

		addFeedback() {
			try {

			} catch (error) {
				console.error('Erro ao atualizar o status da guia:', error);
			}
		}
	},

	async mounted() {
		await this.fetchGuide();
		this.selectedWasteType = this.$route.params.wasteType; // Get the waste type from the route parameters
	},

	watch: {
		guideChanges: {
			deep: true,
			handler() {
			this.checkGuideStatus();
			}
		}
	}
}
</script>

<style scoped>
.subtitle {
	margin: 20px 0 20px 100px;
	font-size: 18px;
}
.v-timeline {
	margin-left: 5vw;
	width: 730px;
}
::v-deep(.custom-timeline-item .v-timeline-item__body) { 
	background-color: #f0f4f8;
	border-radius: 8px;
	padding: 20px;
	width: 80vw;
	margin-left: 20px;
}
.cont-timeline, .weight-collected {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.collection-point {
	margin-bottom: 20px;
}
h2 {
	margin: 130px 0 10px 100px;	
}
h2,h3,p,ul,li, .v-input {
		color: #333;
}
.v-textarea {
	width: 97%;
}
.v-checkbox {
	margin-right: 50px;
	margin-left: -50px;
}
</style> 