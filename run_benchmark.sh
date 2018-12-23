#!/usr/bin/env bash

#define working directory
#this needs to be updated per agent.
work_dir="/usr/git/garage/"

#pull repo to working directory
repo="https://github.com/rlworkgroup/garage.git"
branch="automated-benchmarking"
test_file="tests.benchmarks.quicktest_ddpg"

cd $work_dir
rm -rf "$work_dir/garage"
git clone "$repo"
cd "$work_dir/garage"
git checkout "$branch"

docker build . -t garage-ci -f docker/Dockerfile.ci --build-arg MJKEY="$(cat ~/.mujoco/mjkey.txt)"
docker rm garage_benchmark
docker run --name garage_benchmark -e MJKEY="$(cat ~/.mujoco/mjkey.txt)" garage-ci nose2 -c setup.cfg "$test_file"
echo "done running benchmarks in docker"

cd "$work_dir"
rm -rf "$work_dir/docs/resources/*"
docker cp garage_benchmark:/root/code/garage/latest_results/ddpg/progress.json "$work_dir/docs/resources"
echo "done copying results"

#commit only if above was succesful.
jsonfile="$work_dir/docs/resources/progress.json"
if [ -f "$jsonfile" ]
then
    git add -A "$jsonfile"
    git commit -m "update progress json"
    git push
else
    echo "progress.json not found"
fi 


