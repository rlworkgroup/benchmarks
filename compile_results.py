import os.path as osp
import os, sys, json
import datetime

def compile_results(in_path, out_file):
    results = {}
    results["algos"] = {}
    results["timestamp"] = datetime.datetime.now()
    for filename in os.listdir(in_path):
        if "progress" in filename:
            f = open(os.path.join(in_path, filename), 'r').read()
            algo_json = json.loads(f)
            for algo in algo_json.keys():
                results["algos"][algo] = algo_json[algo]
    f = open(out_file, "w")
    f.write(json.dumps(results))
    f.close()

if __name__ == "__main__":
    in_path = sys.argv[1]
    out_file = sys.argv[2]
    compile_results(in_path, out_file)