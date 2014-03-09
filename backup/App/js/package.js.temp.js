/*
* Hack by scalaberch
* For operating the TwBootstrap3
*/


Package.describe({
    summary: "Load bootstrap script."
});

Package.on_use(function(api) {
    api.add_files('bootstrap.css', 'client');
    api.add_files('bootstrap.min.css', 'client');
    api.add_files('bootstrap.js', 'client');
});