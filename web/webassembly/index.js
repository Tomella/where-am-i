async function loadWebAssembly(fileName) {
   let request = await fetch(fileName);
   let response = await request.arrayBuffer();
   let buffer = await WebAssembly.compile(response);
   let module = new WebAssembly.Instance(buffer);
   return module;
};



let instance = await loadWebAssembly('test.wasm');

let squarer = instance.exports._Z7squareri;
let cuber = instance.exports._Z5cuberi;

console.log('Finished compiling! Ready when you are...', squarer(2), cuber(2));
