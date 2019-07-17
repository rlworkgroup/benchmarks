#!/usr/bin/env bash

#define working directory
work_dir=$(pwd)
# #pull repo to working directory
repo="https://github.com/rlworkgroup/garage.git"
branch="master"

cd $work_dir
rm -rf "$work_dir/garage";rm -rf "$work_dir/docs/resources/*"
git clone "$repo"
cd "$work_dir/garage"
git checkout "$branch"
hash=$(git rev-parse HEAD)

make build-headless

rm -rf "$work_dir/temp/"; mkdir "$work_dir/temp/"
docker container stop garage_benchmark || true && docker rm garage_benchmark || true
for FILE in "$work_dir/garage/tests/benchmarks/"*
    do
            testname=`basename $FILE .py`
            if [[ $testname == "test"* ]]
            then
                echo "running test: $testname"
                docker run --name garage_benchmark -e MJKEY="$(cat ~/.mujoco/mjkey.txt)" rlworkgroup/garage-headless pytest ./tests/benchmarks/$testname.py
                docker cp garage_benchmark:/root/code/garage/latest_results/progress.json "$work_dir/temp/progress_$testname.json"
                docker container rm garage_benchmark
                echo "done with $testname"
            fi
    done   

python "$work_dir/compile_results.py" "$work_dir/temp" "$work_dir/docs/resources/progress.json" "$hash"
#commit only if above was succesful.
jsonfile="$work_dir/docs/resources/progress.json"
if [ -f "$jsonfile" ]
then
    cd "$work_dir"
    git add "$jsonfile"
    git commit -m "update progress json"
    git push
else
    echo "progress.json not found"
fi 

