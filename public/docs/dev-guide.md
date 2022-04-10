## Analysis port config

### Pre-requisite
  You need to open a new deepomics account for your platform, then create a project and build the analysis modules.

### Program code config
Change the UID, PROJECT_ID in `$root/app/controllers/submit_controller.rb`. UID is your deepomics user id.

### Admin config
Follow the guide [how to create a visualizer](visualizer.md) to create a, the `mid` of the anlysis should be the module id of your deepomics module. The mid can be found in the url of the deepomics module page.

Now go to the submit analysis page of your local server, you should see the new added analysis.