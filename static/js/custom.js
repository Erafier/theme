window.activeProject = {
    backendUrl: '/api/v1/projects/session',
    localStorageKey: 'selectedProject',
    fetch: async () => {
        const resp = await fetch(activeProject.backendUrl)
        if (resp.ok) {
            const projectData = await resp.json()
            return projectData.id
        }
        return null
    },
    get: async () => {
        let projectId = localStorage.getItem(activeProject.localStorageKey)
        if (projectId === null) {
            projectId = await activeProject.fetch()
        }
        projectId === null ?
            await activeProject.delete(false)
            :
            activeProject.set_local(projectId)
        return projectId
    },
    set: async id => {
        // console.log('setting proj id', id)
        const resp = await fetch(`${activeProject.backendUrl}/${id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: {}
        })
        if (resp.ok) {
            // const resp_msg = await resp.json()
            activeProject.set_local(id)
            return id
        } else {
            await activeProject.delete(false)
            return null
        }
    },
    set_local: id => localStorage.setItem(activeProject.localStorageKey, id),
    delete: async (make_request = true) => {
        localStorage.removeItem(activeProject.localStorageKey)
        make_request && await fetch(activeProject.backendUrl, {
            method: 'DELETE',
        })
    }
}

window.getSelectedProjectId = () => localStorage.getItem(activeProject.localStorageKey)
$(document).on('vue_init', () => window.getSelectedProjectId = () => vueVm.project_id)

window.wait_for = async (prop_name, root = window, poll_length = 500) => {
    while (!root.hasOwnProperty(prop_name))
        await new Promise(resolve => setTimeout(resolve, poll_length))
    return root[prop_name]
}
