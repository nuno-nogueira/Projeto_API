<template>
	<v-data-table 
		:headers="headers" 
		:items="guides" 
		:loading="loading" 
		item-value="uniqueId"
		v-model:expanded="expandedItems"
	>
		<template v-slot:item.data-table-expand="{ item }">
			<v-btn @click="toggleExpand(item)" variant="text" size="small" class="text-none" color="medium-emphasis">
				<v-icon>
					{{ expandedItems.includes(item.uniqueId) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
				</v-icon>
			</v-btn>
		</template>

		<!-- Column DATE formated -->
		<template v-slot:item.issue_date="{ value }">
			{{ formatDate(value) }}
		</template>

		<template v-slot:item.waste_type="{ item }">
			{{ item.waste_type?.name || 'N/A' }}
		</template>

		<template v-slot:item.actions="{ item }">
			<v-btn :to="{ name: 'guide', params: { id: item.collection_guide_id, wasteType: item.waste_type?.name } }"
				color="#4CAF50" size="small">
				Ver detalhes
			</v-btn>
		</template>

		<template v-slot:expanded-row="{ item }">
			<tr>
				<td :colspan="headers.length" class="py-2">
					<v-sheet rounded="lg" border>
						<v-table density="compact">
							<tbody class="bg-surface-light">
								<tr>
									<th>Responsável</th>
									<th>Veículo</th>
									<th>Nr ocorrências</th>
								</tr>
							</tbody>

							<tbody>
								<tr>
									<td>{{ item.driver?.name || 'N/A' }}</td>
									<td>{{ item.vehicle?.plate || 'N/A' }}</td>
									<td>{{ item.feedback_count || 0 }}</td>
								</tr>
							</tbody>
						</v-table>
					</v-sheet>
				</td>
			</tr>
		</template>
	</v-data-table>
</template>
<script>
import CollectionGuidesService from '@/api/collectionGuides.js';

export default {
	data() {
		return {
			headers: [
				{ title: '', value: 'data-table-expand', sortable: false, width: '50px' },
				{ title: 'NR GUIA', value: 'collection_guide_id', align: 'start', sortable: true },
				{ title: 'DATA', value: 'issue_date', align: 'start' },
				{ title: 'ESTADO', value: 'collection_status', align: 'start' },
				{ title: 'RESÍDUO', value: 'waste_type.name', align: 'start' },
				{ title: '', value: 'actions', align: 'end', sortable: false }
			],
			guides: [],
			loading: false,
			expandedItems: []
		};
	},
	methods: {
		toggleExpand(item) {
			const id = item.uniqueId;
			if (this.expandedItems.includes(id)) {
				this.expandedItems = [];
			} else {
				this.expandedItems = [id];
			}
		},

		async fetchGuides() {
			this.loading = true;
			try {
				const response = await CollectionGuidesService.allCollectionGuides();
				const rawGuides = response.data;
				const processedGuides = [];
				// console.log(rawGuides)		
				const guidesList = [];			
				console.log(rawGuides);
				
				rawGuides.forEach(guide => {
					const route = guide.route;
					let motorista = route.user;
					const wasteTypes = {};
					
					// console.log(guide.rfid_readings);

					guide.rfid_readings.forEach(reading => {
						const collectionPoint = reading?.container?.collection_point;
						// console.log(collectionPoint);

						collectionPoint.containers.forEach(container => {
							let wasteType = container?.waste_type?.name;
							wasteType = container.waste_type.name.trim();

							if (!wasteTypes[wasteType]) {
								wasteTypes[wasteType] = {
									uniqueId: `${guide.collection_guide_id}-${wasteType}`,
									collection_guide_id: guide.collection_guide_id,
									issue_date: guide.issue_date,
									collection_status: guide.collection_status,
									waste_type: container.waste_type,
									containers: [],
									street_name: collectionPoint.street_name,
									collection_point_type: collectionPoint.collection_point_type,
									route: guide.Kroute,
									driver: guide.route?.user,
									vehicle: guide.waste_type?.vehicles?.[0],
									total_weight_collected: 0, 
									feedback_count: guide.feedback_count || 0
								}
							}
							
							if (!wasteTypes[wasteType].containers.includes(container.container_id)) {
									wasteTypes[wasteType].containers.push(container.container_id);
								}

							container.rfid_readings?.forEach(r => {
								wasteTypes[wasteType].total_weight_collected += r.weight_collected;
								wasteTypes[wasteType].feedback_count = guide.feedback_count || 0;

								
							});
						
							// console.log(feedbackCount);
								
						})
						
					})
					Object.values(wasteTypes).forEach(item => guidesList.push(item));

				});

				console.log(guidesList);
				this.guides = guidesList;
				
			} catch (error) {
				console.error('Erro ao carregar as guias:', error);
			} finally {
				this.loading = false;
			}
		},
		formatDate(dateString) {
			if (!dateString) return 'N/A'; //not available
			const date = new Date(dateString);
			return date.toLocaleDateString('pt-pt');
		}
	},
	mounted() {
		this.fetchGuides();
	}

}
</script>
<style scoped>
.v-data-table {
	max-width: 800px;
	margin: 150px auto;
}
</style>