
<template>
	<v-data-table
		:headers="headers"
		:items="guides"
		:loading="loading"
		item-value="container_id"
		v-model:expanded="expandedItems"
	>
		<template v-slot:item.data-table-expand="{ item }">
			<v-btn
				@click="toggleExpand(item)"
				variant="text"
				size="small"
				class="text-none"
				color="medium-emphasis"
			>
				<v-icon>
					{{ expandedItems.includes(item.container_id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
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
			<v-btn
				:to="{ name: 'guide', params: { id: item.collection_guide_id, wasteType: item.waste_type?.name } }"
				color="#4CAF50"
				size="small"
			>
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
									<td>{{ item.route?.user?.name || 'N/A' }}</td> 
									<td>{{ item.waste_type?.vehicles?.plate || 'N/A' }}</td>
									<td>{{ item.route?.user?.Feedback?.length || 0 }}</td>
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
			const id = item.container_id;
			const index = this.expandedItems.indexOf(id);
			if (index > -1) {
					this.expandedItems.splice(index, 1);
			} else {
					this.expandedItems.push(id);
			}
		},
		async fetchGuides() {
			this.loading = true;
			try {
				const response = await CollectionGuidesService.allCollectionGuides();
				const rawGuides = response.data;
				const processedGuides = [];
				
				rawGuides.forEach(guide => {
					// Check if guide has a collection point
					const point = guide.route?.user?.collection_point;
					if (!point) { return }

					// Check is collection point has containers
					if (!point.containers || point.containers.length === 0) {
						console.log(`Guia ${guide.collection_guide_id} não tem contentores.`);
						return;
					}

					// Process all of the containers in each collection point
					point.containers.forEach(container => {
						if (!container.waste_type) {
							return;
						}
						// Add the processed guide info to the array
						processedGuides.push({
							collection_guide_id: guide.collection_guide_id,
							issue_date: guide.issue_date,
							collection_status: guide.collection_status,
							waste_type: container.waste_type,  
							route: guide.route,
							container_id: container.container_id,
							street_name: point.street_name,
							collection_point_type: point.collection_point_type,
							total_weight_collected: container.rfid_readings.reduce(
								(sum, reading) => sum + reading.weight_collected, 0
							),
						});
					});
				});
				this.guides = processedGuides;
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