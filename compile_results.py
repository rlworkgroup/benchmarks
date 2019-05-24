import os.path as osp
import os, sys, json
import datetime

def compile_results(in_path, out_file, git_hash):
    results = {}
    results["algos"] = {}
    results["timestamp"] = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    results["tasks"]=[]
    results["githash"]= git_hash

    for filename in os.listdir(in_path):
        if "progress" in filename:
            f = open(os.path.join(in_path, filename), 'r').read()
            algo_json = json.loads(f)
            for algo in algo_json.keys():
                results["algos"][algo] = algo_json[algo]
                if type(algo_json[algo]) is str:
                    continue
                for task in algo_json[algo].keys():
                    if task not in results["tasks"] and task != "time_start":
                        results["tasks"].append(task)
    if len(results["tasks"]) is 0 or results["algos"] is 0:
        #dont write file if data is missing.  this is how the benchmark.sh knows not to commit empty results
        return

    f = open(out_file, "w")
    f.write(json.dumps(results))
    f.close()

if __name__ == "__main__":
    in_path = sys.argv[1]
    out_file = sys.argv[2]
    git_hash = sys.argv[3]
    compile_results(in_path, out_file, git_hash)