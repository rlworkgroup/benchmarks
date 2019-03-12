#!/usr/bin/env bash

#define working directory
work_dir="/home/kevincheng/Git/benchmarks/"
# #pull repo to working directory
repo="https://github.com/rlworkgroup/garage.git"
branch="Automated_Benchmarking_normalized"

cd $work_dir
rm -rf "$work_dir/garage";rm -rf "$work_dir/docs/resources/*"
git clone "$repo"
cd "$work_dir/garage"
git checkout "$branch"

make build-headless

rm -rf "$work_dir/temp/"; mkdir "$work_dir/temp/"

for FILE in ls "$work_dir/garage/tests/benchmarks/continuous_integration/"*
    do
            testname = `basename $FILE .py`
            docker run --name garage_benchmark -e MJKEY="$(cat ~/.mujoco/mjkey.txt)" rlworkgroup/garage-headless nose2 -c setup.cfg tests.benchmarks.continuous_integration.$testname
            docker cp garage_benchmark:/root/code/garage/latest_results/progress.json "$work_dir/temp/progress_$testname.json"
            docker container rm garage_benchmark
            echo "done with $testname"
    done   

python "$work_dir/compile_results.py" "$work_dir/temp" "$work_dir/docs/resources/progress.json"
# #commit only if above was succesful.
jsonfile="$work_dir/docs/resources/progress.json"
if [ -f "$jsonfile" ]
then
    git add "$jsonfile"
    git commit -m "update progress json"
    git push
else
    echo "progress.json not found"
fi 

