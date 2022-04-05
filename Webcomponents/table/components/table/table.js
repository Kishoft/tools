import styles from './table.css' assert { type: 'css'};

class TableComponent extends HTMLElement {

    data = [];

    get src() {
        return this.getAttribute("src")
    }

    get columnsKeys() {
        return this.getAttribute("columns-keys").split(',').map(key => key.trim())
    }

    get itemsPerPage() {
        return Number(this.getAttribute("items-per-page"))
    }

    get orderDirection(){
        return this.shadowRoot.getElementById("table-filter-selector").value
    }

    static get observedAttributes() {
        return ["src", "columns-keys", "items-per-page"];
    }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    fetchJSONData(url) {
        return fetch(url)
            .then(response => response.json())
            .then(data => { this.data = data })
    }

    sortDataBy(key){
        if(key) { this.lastSortKey = key }
        this.data.sort((a, b) => {
            if(this.orderDirection === "asc"){
                return a[this.lastSortKey] > b[this.lastSortKey] ? 1 : -1;
            }
            else if(this.orderDirection === "desc"){
                return a[this.lastSortKey] < b[this.lastSortKey] ? 1 : -1;
            }

        })
        
        this.renderTableBody(this.currentPage);
    }

    createFilters(){

        let limiter = document.createElement("input");
        limiter.type = "number";
        limiter.id = "items-limit";
        limiter.placeholder = "Items length"
        limiter.value = 4;
        limiter.addEventListener("change", e => {

        })

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

    async renderTableBody(page) {

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
        let paginator = document.createElement("div");

        paginator.id = "paginator";

        let pages = this.data.length / this.itemsPerPage;

        for (let i = 0; i < pages; i++) {

            let page = document.createElement("button");
            page.classList.add("page-button");

            page.textContent = i + 1;

            page.addEventListener("click", () => {
                this.renderTableBody(i);
            })

            paginator.appendChild(page);

        }

        let itemsPerPage = document.createElement("select");
        itemsPerPage.id = "items-per-page";
        itemsPerPage.addEventListener("change", e => {})

        let itemsPerPageOptions = [25, 50, 100, 200];

        itemsPerPageOptions.forEach(option => {
            let optionElement = document.createElement("option");
            optionElement.textContent = option;
            optionElement.value = option;
            itemsPerPage.appendChild(optionElement);
        })

        this.shadowRoot.append(paginator, itemsPerPage)
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