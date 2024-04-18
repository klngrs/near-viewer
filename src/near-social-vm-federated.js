import { init, loadRemote, loadShare } from '@module-federation/enhanced/runtime';
import React from "react";
import ReactDOM from "react-dom";

let _NearVM;

export async function loadVM(opts) {

    // init host gateway container
    init({
        name: 'near_gateway',
        remotes: [
            {
                name: opts.name,
                entry: opts.entry,
                alias: "near-social-vm"
            },
        ],
        shared: {
            react: {
                version: '18.2.0',
                scope: 'default',
                lib: () => React,
                shareConfig: {
                    singleton: true,
                    requiredVersion: '^18.2.0',
                },
            },
            'react-dom': {
                version: '18.2.0',
                scope: 'default',
                lib: () => ReactDOM,
                shareConfig: {
                    singleton: true,
                    requiredVersion: '^18.2.0',
                },
            },
        },
    });

    // load shared deps
    const [reactFactory, reactDomFactory] = await Promise.all([loadShare('react'), loadShare('react-dom')])
    global.React = reactFactory();
    global.ReactDOM = reactDomFactory();

    // load remote VM
    const vm = await loadRemote('near-social-vm/index');
    _NearVM = vm;
    return vm;
}

const dynamicVmExports = new Proxy({
    loadVM: loadVM
}, {
    get: function(target, prop, receiver) {
        if (prop in target) {
            // existing props like loadVM
            return target[prop];
        } else {
            // custom logic for unknown properties
            return _NearVM[prop]; // return the prop on the async-pulled VM
            // return `Property ${prop} not found`;
        }
    }
});


export default dynamicVmExports;
