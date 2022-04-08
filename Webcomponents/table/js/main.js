import('/components/loader/loader.js')
    .then(() => {
        Promise.allSettled([
            import('/components/table/table.js'),
        ])
    })
