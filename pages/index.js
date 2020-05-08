import path from 'path';
import {Storage} from "@google-cloud/storage";

import React, {useState} from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import EnvsDropdown from "../components/EnvsDropdown";
import Figure from "../components/Figure";

const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);

function Home({ files }) {
    const groups = groupBy(files, 'env');
    const envs = [...new Set(files.map(file => file['env']))];
    const [currentEnv, setCurrentEnv] = useState(envs[0]);

    return (
        <div>
            <Header/>
            <EnvsDropdown envs={envs} currentEnv={currentEnv} setCurrentEnv={setCurrentEnv}/>
            <Figure lines={groups[currentEnv]}/>
            <Footer/>
        </div>
    );
}

export async function getStaticProps() {
    async function loadFromGCP() {
        console.log('Loading from GCP...');
        const projectId = 'resl-garage-web';
        const keyFilename = path.join(process.cwd(), 'resl-garage-web-cc2f96250a9c.json');
        const storage = new Storage({projectId, keyFilename});
        const bucket = storage.bucket('resl-garage-benchmarks');

        const files = await bucket.getFiles().then((data) => {
            return data[0];
        });

        return await Promise.all(files.map(async file => {
            console.log('Loading: ' + file.name);
            let archivo = file.createReadStream();
            let buf = '';
            return new Promise(((resolve, reject) => {
                archivo.on('data', (d) => {
                    buf += d;
                }).on('end', () => {
                    resolve([file.name, buf]);
                });
            }));
        }));
    }
    let filesContent = await loadFromGCP();
    console.log('Loading finished.');

    console.log('Processing...');
    const JSONResults = filesContent.map(fileContent => {
        let env, algo, xs, ys, ys_min, ys_max, x_label, y_label;
        [env, algo] = fileContent[0].substring(0, fileContent[0].length - 5).split('_');
        const JSONContents = JSON.parse(fileContent[1]);

        xs = JSONContents['x'];
        ys = JSONContents['y'];
        ys_min = JSONContents['y_min'];
        ys_max = JSONContents['y_max'];
        x_label = JSONContents['xlabel'];
        y_label = JSONContents['ylabel'];

        return { env, algo, xs, ys, ys_min, ys_max, x_label, y_label }
    });
    console.log('Processing finished.');

    return {
        props: {
            files: JSONResults,
        },
    }
}


export default Home;
