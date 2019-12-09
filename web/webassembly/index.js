let squarer, cuber;

async function loadWebAssembly(fileName) {
   let response = await fetch(fileName)
      .then(response => response.arrayBuffer())
      .then(buffer => WebAssembly.compile(buffer))
      .then(module => { return new WebAssembly.Instance(module) });
};



loadWebAssembly('test.wasm')
   .then(instance => {
      squarer = instance.exports._Z7squareri;
      cuber = instance.exports._Z5cuberi;
      console.log('Finished compiling! Ready when you are...', squarer(2), cuber(2));
   });