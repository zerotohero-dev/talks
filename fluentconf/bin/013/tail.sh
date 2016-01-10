
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "${DIR}"

tail -10f \
"${DIR}/../../containers/013-round-robin/region001/compute001/var/log/fluent/forever-region_1_fluent_compute_1.log" \
"${DIR}/../../containers/013-round-robin/region001/compute002/var/log/fluent/forever-region_1_fluent_compute_2.log" \
"${DIR}/../../containers/013-round-robin/region001/service001/var/log/fluent/forever-region_1_fluent_app_1.log" \
"${DIR}/../../containers/013-round-robin/region001/service002/var/log/fluent/forever-region_1_fluent_app_2.log" \
"${DIR}/../../containers/013-round-robin/region002/compute001/var/log/fluent/forever-region_2_fluent_compute_1.log" \
"${DIR}/../../containers/013-round-robin/region002/compute002/var/log/fluent/forever-region_2_fluent_compute_2.log" \
"${DIR}/../../containers/013-round-robin/region002/service001/var/log/fluent/forever-region_2_fluent_app_1.log" \
"${DIR}/../../containers/013-round-robin/region002/service002/var/log/fluent/forever-region_2_fluent_app_2.log"
