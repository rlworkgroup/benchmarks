#This script runs the benchmarks in an infinite loop.
#It will be used as the server job
#Author: Kevin Cheng

benchmark_script="./run_benchmark_multi.sh"
while :
do
    git fetch --all
    git checkout master
    git reset --hard
    echo "Press [Ctrl+C] to stop"
    "$benchmark_script"
done