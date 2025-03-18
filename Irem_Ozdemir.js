(async function() {
    const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const STORAGE_KEY = "lcwaikiki_products";
    const FAVORITES_KEY = "lcwaikiki_favorites";

    // ** Sayfanın ürün detay sayfası olup olmadığını kontrol et **
    if (!document.querySelector(".product-detail")) return;

    // ** LocalStorage'dan favori ürünleri al **
    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

    // ** Ürünleri getir veya cache'ten al **
    let products = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!products) {
        try {
            const response = await fetch(API_URL);
            products = await response.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        } catch (error) {
            console.error("Ürünler yüklenirken hata oluştu!", error);
            return;
        }
    }

    // ** Karusel ana container'ını oluştur **
    const carouselContainer = document.createElement("div");
    carouselContainer.classList.add("product-carousel");

    carouselContainer.innerHTML = `
        <h2 class="carousel-title">Bunları da Beğenebilirsiniz</h2>
        <div class="carousel-wrapper">
            <button class="carousel-prev">&#10094;</button>
            <div class="carousel-items"></div>
            <button class="carousel-next">&#10095;</button>
        </div>
    `;

    const carouselItems = carouselContainer.querySelector(".carousel-items");
    
    // ** Ürünleri döngü ile ekle **
    products.forEach(product => {
        const isFavorite = favorites.includes(product.id);
        const productElement = document.createElement("div");
        productElement.classList.add("carousel-item");

        productElement.innerHTML = `
            <a href="${product.url}" target="_blank">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <p class="product-name">${product.name}</p>
            <span class="favorite-icon ${isFavorite ? 'favorited' : ''}" data-id="${product.id}">&#9829;</span>
        `;

        // ** Kalp ikonuna tıklama olayını yönet **
        const favoriteIcon = productElement.querySelector(".favorite-icon");
        favoriteIcon.addEventListener("click", function(event) {
            event.stopPropagation();
            toggleFavorite(product.id, favoriteIcon);
        });

        carouselItems.appendChild(productElement);
    });

    // ** Sayfadaki "product-detail" öğesinin altına ekle **
    document.querySelector(".product-detail").after(carouselContainer);

    // ** Favori ekleme/çıkarma fonksiyonu **
    function toggleFavorite(productId, iconElement) {
        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
            iconElement.classList.remove("favorited");
        } else {
            favorites.push(productId);
            iconElement.classList.add("favorited");
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }

    // ** Karusel kaydırma fonksiyonları **
    const prevBtn = carouselContainer.querySelector(".carousel-prev");
    const nextBtn = carouselContainer.querySelector(".carousel-next");

    prevBtn.addEventListener("click", () => {
        carouselItems.scrollBy({ left: -200, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
        carouselItems.scrollBy({ left: 200, behavior: "smooth" });
    });

    // ** CSS Stilleri ekleyelim **
    const style = document.createElement("style");
    style.innerHTML = `
        .product-carousel {
            margin-top: 20px;
            padding: 10px;
            border-top: 2px solid #ddd;
        }
        .carousel-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .carousel-wrapper {
            display: flex;
            align-items: center;
            position: relative;
        }
        .carousel-items {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            scroll-behavior: smooth;
            white-space: nowrap;
            flex: 1;
        }
        .carousel-item {
            min-width: 150px;
            text-align: center;
            flex-shrink: 0;
        }
        .carousel-item img {
            width: 100%;
            border-radius: 5px;
        }
        .product-name {
            font-size: 14px;
            margin: 5px 0;
        }
        .favorite-icon {
            cursor: pointer;
            font-size: 18px;
            color: #bbb;
        }
        .favorite-icon.favorited {
            color: blue;
        }
        .carousel-prev, .carousel-next {
            background: rgba(0, 0, 0, 0.1);
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
            margin: 0 5px;
            border-radius: 50%;
        }
        .carousel-prev:hover, .carousel-next:hover {
            background: rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(style);
})();
