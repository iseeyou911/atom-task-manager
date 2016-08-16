'use babel';

import path from 'path';
import fs from 'fs';
import EventEmitter from 'events';

const PACKAGE_JSON = 'package.json';

export default class NPM extends EventEmitter {
    constructor(projectPaths = []) {
        this.isLoading = true;

        Promise.all(
            projectPaths
            .map(path => this.getPackageJson(path))
            .map(promise => {
                return promise
                    .then(package => this.getCommands(package))
                    .catch(() => Promise.resolve(false));
            })
        )
        .then(packages => {
            this.isLoading = false;
            this.emit('update', packages);
        });
    }

    getCommands({root, package: {run}}) {
        return {
            root,
            commands: Object.keys(run)
        };
    }

    getPackageJson(root) {
        return new Promise(resolve => {
            const filePath = path.join(root, PACKAGE_JSON);
            fs.readFile(filePath, (error, data) => {
                if (error) {
                    reject();
                    return;
                }

                try {
                    resolve({
                        root,
                        package: JSON.parse(data)
                    });
                } catch (e) {
                    reject();
                }
            });
        });
    }
}
