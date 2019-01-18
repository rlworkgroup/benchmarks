#!/usr/bin/env bash

#define working directory
<<<<<<< HEAD
work_dir="/home/kevincheng/Git/garage_benchmarks/"
=======
#this needs to be updated per agent.
work_dir="/usr/git/garage/"

>>>>>>> 03c490d50d6e0bfbe595f46af8ef9b425d617068
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
docker stop garage_benchmark

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
<<<<<<< HEAD
    git add "$jsonfile"
=======
    git add -A "$jsonfile"
>>>>>>> 03c490d50d6e0bfbe595f46af8ef9b425d617068
    git commit -m "update progress json"
    git push
else
    echo "progress.json not found"
fi 


