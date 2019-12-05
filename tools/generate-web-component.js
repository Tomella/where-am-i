const argv = require("yargs")
               .usage('Usage: $0 <file-name> [options]')
               .argv;

console.log("name: ", argv._)

let parts = argv._;

let dir = argv.d
dir = dir ? dir: "../web/components";

if(!parts.length) {
   console.log("You need to provide a name for the file and class names. Preferrably something like fred-input ");
   process.exit();
}

let name = parts[0].replace(".js", "").toLowerCase();

let className = name.split("-").map(part => (part.charAt(0).toUpperCase() + part.substr(1))).join("");


let NAME = name;
let CLASS_NAME = className;

const template = `
const template = document.createElement('template')
template.innerHTML = \`
   <div>Your HTML content goes here.</div>
\`;

customElements.define('${NAME}', class ${CLASS_NAME} extends HTMLElement {

   $(selector) {
      return this.shadowRoot && this.shadowRoot.querySelector(selector)
   }

   constructor() {
      super();
      // Normally you are adding the template
      const root = this.attachShadow({ mode: 'open' })
      root.appendChild(template.content.cloneNode(true))
   }

   connectedCallback() {
      this.shadowRoot.addEventListener('click', (e) => console.log(e));
   }
});
`;

const fs = require('fs');
const file_name = dir + "/" + NAME + ".js";

if(fs.existsSync(file_name)) {
   console.log(file_name + " already exists. Review and delete file with same name before writing.");
   process.exit();
}

fs.writeFile(file_name, template, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved to: " + file_name);
    process.exit();
});