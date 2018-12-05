#define working directory
#workdir = "~/testagent/"
#pull repo to working directory
rm -rf ./garage
git clone https://github.com/rlworkgroup/garage.git 
cd garage
git checkout automated-benchmarking

docker build . -t garage-ci -f docker/Dockerfile.ci --build-arg MJKEY="$(cat ~/.mujoco/mjkey.txt)"
docker rm garage_benchmark
docker run --name garage_benchmark -e MJKEY="$(cat ~/.mujoco/mjkey.txt)" garage-ci nose2 -c setup.cfg tests.benchmarks.test_json
echo "done running benchmarks from docker"

rm -rf garage-dashboard/resources/*
docker cp garage_benchmark:/root/code/garage/benchmark_ddpg/latest/*.png docs/resources
echo "done copying results"

#clear the resources folder
# rm -rf garage-dashboard/resources/*
# cp -r benchmark_ddpg/latest/*.png garage-dashboard/resources

