import createWorkerMiddleware from 'redux-worker-middleware';

const Worker = require('worker-loader!../../workers/networking'); // webpack's worker-loader

const worker = new Worker();

const workerMiddleware = createWorkerMiddleware(worker);

export default workerMiddleware;
