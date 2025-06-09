<template>
	<div>
		<h2>Guia de Recolha NGID0{{ guide?.collection_guide_id }}</h2> 
		<!-- or <h2 v-if="guide">Guia de Recolha NGID0{{ guide.collection_guide_id }}</h2> -->
		 <!-- Without "?" Vue could try to access guide.collection_guide_id before it is uploaded and it would give an error. With "guide?.collection_guide_id", it only tries to access the guide when it is already defined -->
		<p class="subtitle"><strong>Estado:</strong> {{ guide?.collection_status }}</p>
		<p class="subtitle"><strong>Rota:</strong> {{ guide?.route_id }}</p>


		<div v-if="guide">
			<div v-for="(point, i) in guide.route.collection_points" :key="i" class="collection-point">
				<p v-if="filteredContainers(point.containers).length === 0">Sem contentores neste ponto.</p>
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
							/>	
							
						</div>
						<v-textarea
								v-model="guideChanges[container.container_id].report"
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
			guideChanges: {}, // Where the values from backend are going to be inserted but also where the new values are being stored
			selectedWasteType: null // Save the type of waste selected by the user
		}
	},
	methods: {
		filteredContainers(containers) { // v-for will call this function 
			console.log('Containers recebidos:', containers);
			if (!this.selectedWasteType) return containers; // If there is no filter selected, return all containers
			// return containers.filter(
			// 	container => container.waste_type.name.trim() === this.selectedWasteType.trim() // Filter the containers by the selected waste type
			// );
			const filtrados = containers.filter(
				container => container.waste_type.name.trim() === this.selectedWasteType.trim()
			);
			console.log('Containers filtrados:', filtrados);
			return filtrados;
		},
		// This function fetches the guide and the rfid readings data:
		async fetchGuide() {
			try {
				const guideID = this.$route.params.id; // Access the id parameter through the parameters defined in the route path -> /guide/:id
				const guideResponse = await axios.get(`http://localhost:3000/collection-guides/${guideID}`); // Get the guide data from the backend
				this.guide = guideResponse.data; // Save the guide data to the component's state
				console.log('Guide carregado:', this.guide);

				// Get the existing data from the backend and insert it into guideChanges (the fields or initialize them)
				this.guide.route.collection_points.forEach(point => { 
					point.containers = point.containers || [];
					point.containers.forEach(container => {
						const existing = this.guideChanges[container.container_id] || {}; // Get existing data or initialize an empty object
						this.guideChanges[container.container_id] = { 
							weight: existing.weight || 0,
							status: existing.status || false,
							report: existing.report || 'yellow',
							readingID: existing.readingID || null
						};
					});
				});

				// Return the readings data for the guide which includes the "weight_collected" and the "rfid_reading_id":
				const readingsResponse = await axios.get(`http://localhost:3000/readings/collection-guides/${guideID}`); 
				// This data will be used to update the guideChanges object with the current weight and reading ID for each container
				readingsResponse.data.forEach(reading => {
					if (this.guideChanges[reading.container_id]) { // Only update a container_id that is in guideChanges
						this.guideChanges[reading.container_id] = {
							...this.guideChanges[reading.container_id], // Copy everything that was already in guideChanges[container_id] to keep old values
							// and update with the new data if the user inserts new data:
							weight: reading.weight_collected || 0,
							readingID: reading.rfid_reading_id,
						};
					}
				});
			} catch (error) {
				console.error('Erro ao carregar guia:', error);
			}
		},

		// This function saves the data for a specific container
		async saveContainerData(container_id) {
			const change = this.guideChanges[container_id];
			if (!change) return;

			try {
				if (change.readingID) {
					// Update existing reading
					await axios.patch(`http://localhost:3000/readings/${change.readingID}`, {
						weight_collected: change.weight,
						collection_status: change.status
					});
				} else {
					// Create new reading
					const response = await axios.post('http://localhost:3000/readings', {
						container_id: container_id,
						collection_guide_id: this.guide.collection_guide_id,
						reading_date: new Date().toISOString(),
						weight_collected: change.weight,
						collection_status: change.status
					});

					// Update the reading id on guideChanges with the new one to prevent duplicated saves on the database
					this.guideChanges[container_id].readingID = response.data.rfid_reading_id;
				}
				alert('Dados guardados com sucesso.');

			} catch (err) {
				console.error('Erro ao guardar dados:', err);
			}
		},
	},
	mounted() {
		this.fetchGuide();
		this.selectedWasteType = this.$route.params.wasteType; // Get the waste type from the route parameters
		console.log('Waste type selecionado:', this.selectedWasteType);
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