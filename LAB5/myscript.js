fetch('product.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        let products = json;
        // initialize json file
        init(products);
    })
    .catch(function(err) {
        console.log('Fetch problem:' + err.message);
    })

function init(products) {
    console.log(products)
    // use for manipulating page
    const category = document.getElementById("category");
    const searchTerm = document.getElementById("searchTerm");
    const searchBtn = document.querySelector("button");
    const main = document.querySelector("main");

    // category before change
    let lastCategory = category.value;
    let lastSearch = "";

    // objects(products) arrays
    // contain products to be displayed after "category" select
    let categoryGroup;
    // final products to be displayed after checking "searchTerm"
    let finalGroup;

    // first loaded, view all products
    finalGroup = products;

    // display products in web
    // change <main>'s content
    Display();



    // categoryGroup = [];
    // finalGroup = [];

    // event handler: search button clicked
    searchBtn.addEventListener("click", selectCategory);

    function selectCategory(e) {
        // e: event object(onclick)
        // display maintain 
        e.preventDefault();

        // clear previous search 
        categoryGroup = [];
        finalGroup = [];

        // first look for "category" and then "searchTerm"
        // look if selection is same as before => don't need to change
        if (category.value === lastCategory && 
            searchTerm.value.trim() === lastSearch) {
                // don't need to change display
                return;
        }
        else {
            lastCategory = category.value;
            lastSearch = searchTerm.value.trim();
            // need to change display
            // first look "category"
            // 'All' or 'specific one'
            if (category.value === "All") {
                categoryGroup = products;
                // look "searchTerm"
                searchFromTerm();
            }
            // one specific category is chosen
            else {
                // product.json type = lowercase
                // modify categoryGroup
                let categoryLower = category.value.toLowerCase();
                for (let i = 0; i < products.length; i++) {
                    for (let x of products[i].type) {
                        if (x === categoryLower) categoryGroup.push(products[i]);
                    }
                }
                // look for "searchTerm"
                searchFromTerm();
            }
        }
    }

    function searchFromTerm() {
        // no "searchTerm" entered => categoryGroup = finalGroup
        if (searchTerm.value.trim() === "") {
            finalGroup = categoryGroup;
            Display(); 
        }
        // "searchTerm" entered(keyword search)
        else {
            // in json, type <- lowercase
            // change into lowercase
            let convertedLower = searchTerm.value.trim().toLowerCase();
            for (let i = 0; i < categoryGroup.length; i++) {
                // product name to lowercase
                let nameLower = categoryGroup[i].name.toLowerCase();
                // substring(convertedLower) is in product name
                if (nameLower.indexOf(convertedLower) !== -1) {
                    finalGroup.push(categoryGroup[i]);
                }
            }
            Display(); 
        }
    }

    function Display() {
        // remove contents in <main>
        while(main.firstChild){
            main.removeChild(main.firstChild);
        }
        // no products to display = finalGroup is empty
        if (finalGroup.length === 0) {
            let newP = document.createElement("p");
            newP.textContent = "No products to display";
            main.appendChild(newP);
        }
        // displaying products exist
        else {
            // first showing 6 contents
            // so next showing index = 6
            contentIndex = 6;
            show6Contents();
        }
    }

    function show6Contents() {

        window.onscroll = () => {
            if (window.innerHeight +window.scrollY >= document.body.offsetHeight) {
                addingElements(contentIndex);
                contentIndex++;
            }
        }

        // firstChild to be deleted when new display need
        let delChild = document.createElement("div");
        delChild.setAttribute("id", "listProducts");
        main.appendChild(delChild);
    
        // 처음 6개만 보여주기 (원래는 i < finalGroup.length)
        for (let i = 0; i < contentIndex; i++) {
            addingElements(i);
        }     
    }

    function addingElements(contentIndex) {
        let addContent = document.createElement("div");
        addContent.setAttribute("class", "image_container");
        document.getElementById("listProducts").appendChild(addContent);
        let image = document.createElement("img");
        image.src = "./images/" + finalGroup[contentIndex].image;
        image.alt = finalGroup[contentIndex].name;
        let name = document.createElement("div");
        name.setAttribute("class", "productName");
        name.textContent = image.alt;
        let price = document.createElement("div");
        price.setAttribute("class", "productPrice");
        price.textContent = finalGroup[contentIndex].price;
        let clicking = document.createElement("button");
        clicking.setAttribute("class", "clicks");
        clicking.setAttribute("id", String(contentIndex));
        clicking.textContent = "Click to see more";
        let imageContainer = document.getElementsByClassName("image_container");
        imageContainer[contentIndex].appendChild(image);
        imageContainer[contentIndex].appendChild(name);
        imageContainer[contentIndex].appendChild(price);
        imageContainer[contentIndex].appendChild(clicking);
    }
}

// click element -> show information
document.addEventListener("click", showInfo);

function showInfo(e) {
    let num = e.target.getAttribute("id");
    let ind = parseInt(num, 10);
    let mod1 = document.getElementsByClassName("productName");
    let mod2 = document.getElementsByClassName("productPrice");
    mod1[ind].setAttribute("style", "color: white");
    mod2[ind].setAttribute("style", "color: white");
}