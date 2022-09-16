export default class ModoolLoader {
    static load(context) {
        window.__modool_modules = {};
        try {
            context.keys().forEach((file_path) => {
                let name = file_path.split('./')[1].split(".")[0];
                window.__modool_modules[name] = new (context(file_path).default)(name);
            });
        } catch(e) {
            console.error("Could not load file", e);
        }
    }

    static checkModules() {
        Object.keys(window.__modool_modules).forEach((name) => {
            let modool = window.__modool_modules[name];
            modool.check();
        });
    }

    static getModule(name) {
        return window.__modool_modules[name];
    }
}
