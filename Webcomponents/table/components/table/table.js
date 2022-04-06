import styles from './table.css' assert { type: 'css'};

class TableComponent extends HTMLElement {

    data = [];

    get src() {
        return this.getAttribute("src")
    }

    get columnsKeys() {
        return this.getAttribute("columns-keys").split(',').map(key => key.trim())
    }

    get orderDirection() {
        return this.shadowRoot.getElementById("table-filter-selector").value
    }

    get itemsPerPageOptions() {
        return [3, 25, 50, 100]
    }

    get itemsPerPage() {
        console.log("chan")
        return Number(this.getAttribute("items-per-page")) || this.itemsPerPageOptions[0]
    }

    set itemsPerPage(itemsPerPage) {
        this.setAttribute("items-per-page", itemsPerPage);
    }

    static get observedAttributes() {
        return ["src", "columns-keys", "items-per-page"];
    }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    debounce(callback, wait) {
        let timerId;
        return (...args) => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                callback(...args);
            }, wait);
        };
    }

    fetchJSONData(url) {
        return fetch(url)
            .then(response => response.json())
            .then(data => { this.data = data })
    }

    sortDataBy(key) {
        if (key) { this.lastSortKey = key }
        this.data.sort((a, b) => {
            if (this.orderDirection === "asc") {
                return a[this.lastSortKey] > b[this.lastSortKey] ? 1 : -1;
            }
            else if (this.orderDirection === "desc") {
                return a[this.lastSortKey] < b[this.lastSortKey] ? 1 : -1;
            }

        })

        this.renderTableBody(this.currentPage);
    }

    createFilters() {

        let limiter = document.createElement("input");
        limiter.type = "number";
        limiter.id = "items-limit";
        limiter.placeholder = "Items length"
        limiter.value = 4;
        limiter.addEventListener('input', this.debounce(() => {
            console.log('Do something');
        }, 700))

        let selector = document.createElement("select");
        selector.id = "table-filter-selector";
        selector.addEventListener("change", e => {
            this.sortDataBy()
        })

        let ascendantOption = document.createElement("option");
        ascendantOption.textContent = "Ascendant";
        ascendantOption.value = "asc";

        let descendantOption = document.createElement("option");
        descendantOption.textContent = "Descendant";
        descendantOption.value = "desc";

        selector.append(ascendantOption, descendantOption);

        this.shadowRoot.append(limiter, selector)
    }

    createTable() {
        let table = document.createElement("table");

        let thead = document.createElement("thead");
        thead.id = "table-header";

        let tbody = document.createElement("tbody");
        tbody.id = "table-body";

        table.append(thead, tbody);

        this.shadowRoot.appendChild(table);
    }

    createPaginator() {
        let paginator = document.createElement("div");
        paginator.id = "paginator";

        if (!this.hasAttribute("items-per-page")) {
            let itemsPerPage = document.createElement("select");
            itemsPerPage.id = "items-per-page";
            itemsPerPage.addEventListener("input", e => {
                console.log(e.target.value)
                this.itemsPerPage = e.target.value;
                this.renderTableBody(0)
                this.renderPaginator()
            })


            this.itemsPerPageOptions.forEach(option => {
                let optionElement = document.createElement("option");
                optionElement.textContent = option;
                optionElement.value = option;
                itemsPerPage.appendChild(optionElement);
            })

            itemsPerPage.selectedIndex = 0;

            this.shadowRoot.append(itemsPerPage)
        }

        this.shadowRoot.appendChild(paginator);
    }

    renderTableHeader() {

        let tr = document.createElement("tr");

        this.columnsKeys
            .forEach(key => {
                let th = document.createElement("th");
                th.textContent = String(key).replaceAll("_", " ");
                th.addEventListener("click", e => {
                    this.sortDataBy(key)
                })
                tr.appendChild(th);
            })

        this.shadowRoot.getElementById("table-header").appendChild(tr);

    }

    renderTableBody(page) {

        this.currentPage = page;

        let initialIndex = page * this.itemsPerPage;

        let tableBody = this.shadowRoot.getElementById("table-body");

        tableBody.innerHTML = "";

        for (let i = initialIndex; i < this.data.length; i++) {

            if (i >= initialIndex + this.itemsPerPage) { break; }

            let tr = document.createElement("tr");

            this.columnsKeys.forEach(key => {
                let td = document.createElement("td");
                td.textContent = String(this.data[i][key] || "-");
                tr.appendChild(td);
            })

            tableBody.appendChild(tr)
        }
    }

    renderPaginator() {

        let paginator = this.shadowRoot.getElementById("paginator");

        paginator.innerHTML = "";

        let pages = Math.ceil(this.data.length / this.itemsPerPage);

        if (this.currentPage > 0) {
            let previous = document.createElement("button");
            previous.textContent = "<";
            previous.classList.add("page-button");
            previous.addEventListener("click", e => {
                this.renderTableBody(this.currentPage - 1)
                this.renderPaginator()
            })

            paginator.appendChild(previous)
        }


        for (let i = 0; i < pages; i++) {

            let page = document.createElement("button");
            page.classList.add("page-button");
            page.textContent = i + 1;
            if (this.currentPage === i) {
                page.classList.add("active")
            }
            page.addEventListener("click", () => {
                this.renderTableBody(i);
                this.renderPaginator();
            })

            paginator.appendChild(page);

        }

        if ((this.currentPage + 1) < pages) {

            let next = document.createElement("button");
            next.textContent = ">";
            next.classList.add("page-button");
            next.addEventListener("click", e => {
                this.renderTableBody(this.currentPage + 1)
                this.renderPaginator()
            })

            paginator.appendChild(next)
        }

    }

    //attributeChangedCallback(attrName, oldVal, newVal) {
    //    if (attrName === "src") {
    //        this.fetchJSONData(newVal)
    //            .then(() => this.render())
    //    }
    //    if(attrName === "columns-keys") {
    //        this.render()
    //    }
    //}
    connectedCallback() {

        document.getElementById("page-loader").setAttribute("loading", "");

        this.shadowRoot.adoptedStyleSheets = [styles];

        this.createFilters();
        this.createTable();
        this.createPaginator()

        this.fetchJSONData(this.src)
            .then(() => {
                this.renderTableHeader();
                this.renderTableBody(0);
                this.renderPaginator();
            })
            .then(() => {
                document.getElementById("page-loader").removeAttribute("loading")
            })
    }
    disconnectedCallback() { }
    //adoptedCallback(){}

}

customElements.define("table-component", TableComponent);