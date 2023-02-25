const blogDateOptions = { month: "long", day: "numeric", year: "numeric" };
const offersDateOptions = { month: "2-digit", day: "2-digit", year: "numeric" };
const testimonialsDateOptions = {
	month: "long",
	day: "numeric",
	year: "numeric",
};
const sunList = document.getElementById("sunList");
const sunMore = document.getElementById("sunMore");
const btnsunMore = document.getElementById("btnsunMore");
const ddlsunCategories = document.getElementById("ddlsunCategories");
const txtsunSearch = document.getElementById("txtsunSearch");
const btnsunSearch = document.getElementById("btnsunSearch");

let requestDataset = btnsunMore && btnsunMore.dataset;

let classBase = btnsunMore && `sun-${btnsunMore.dataset.module}`;
let name = btnsunMore && btnsunMore.dataset.name;
let articleBase = "article";

let requestObj = btnsunMore && {
	page: parseInt(requestDataset.page),
	pagesize: parseInt(requestDataset.pagesize),
	showing: parseInt(requestDataset.showing),
	total: parseInt(requestDataset.total),
	module: requestDataset.module,
	view: requestDataset.view,
	cid: requestDataset.cid,
	excludecid: requestDataset.excludecid,
	url: requestDataset.url,
	search: requestDataset.search,
	json: JSON.parse(requestDataset.json),
};

function requestData(requestType = "btn") {
	if (requestObj.json) {
		sunList.classList.remove(
			`sun-${btnsunMore.dataset.module}__list--none`
		);

		if (requestType != "btn") {
			catID = ddlsunCategories && ddlsunCategories.value;
			catPage = 0;
			catShowing = 0;

			if (requestType === "txt") {
				txtSearch = txtsunSearch.value;
				false
					? updateStructure("zip", txtSearch)
					: updateStructure("search", txtSearch);
			}

			updateStructure("cid", catID);
			updateStructure("page", catPage);
			updateStructure("showing", catShowing);

			sunList.innerHTML = "";
		}

		if (requestObj.showing <= requestObj.total) {
			btnsunMore.classList.toggle("sun-btn--primary--active");

			if (btnsunSearch) {
				btnsunSearch.classList.toggle(
					`sun-${btnsunMore.dataset.module}__controls-btn--active`
				);
			}

			let requestGET = `${requestObj.url}?page=${
				requestObj.page + 1
			}&pagesize=${requestObj.pagesize}${
				requestObj.cid ? `&cid=${requestObj.cid}` : ``
			}${
				requestObj.excludecid
					? `&excludecid=${requestObj.excludecid}`
					: ``
			}${requestObj.search ? `&s=${requestObj.search}` : ``}`;

			let requestXHR = new XMLHttpRequest();
			requestXHR.open("GET", requestGET, true);
			requestXHR.send();

			requestXHR.onload = function () {
				if (requestXHR.status >= 200 && requestXHR.status < 400) {
					let requestData = JSON.parse(requestXHR.responseText);

					items = requestData.response.data;

					if (items.length) {
						items.forEach(function (item) {
							itemArticle = document.createElement("article");
							itemArticle.classList.add(
								`${classBase}__${articleBase}`,
								`${classBase}__${articleBase}--${requestObj.view}`
							);
							if (
								document.head.querySelector(
									'meta[name="msa-user"]'
								)
							) {
								addEditInfo(
									itemArticle,
									item.item.mrid,
									item.item.id,
									item.item.ipid,
									name
								);
							}
							let itemContent = createContent(
								requestObj.module,
								requestObj.view,
								item.item
							);
							itemArticle.innerHTML = itemContent;
							sunList.appendChild(itemArticle);
							if (requestObj.module === "gallery") {
								baguetteBox.run(".gallery");
							}
						});

						if (
							document.head.querySelector('meta[name="msa-user"]')
						) {
							addEditListeners();
						}
					} else {
						sunList.classList.add(
							`sun-${btnsunMore.dataset.module}__list--none`
						);
						sunList.innerHTML = "No results found.";
					}

					if (btnsunSearch) {
						btnsunSearch.classList.toggle(
							`sun-${btnsunMore.dataset.module}__controls-btn--active`
						);
					}
					btnsunMore.classList.toggle("sun-btn--primary--active");

					updateStructure("total", requestData.response.count);
					updateStructure("page", requestObj.page + 1);
					updateStructure(
						"showing",
						requestObj.showing + requestObj.pagesize
					);

					requestObj.showing >= requestObj.total
						? btnsunMore.classList.add("sun-btn--hide")
						: btnsunMore.classList.remove("sun-btn--hide");
				}
			};
		}
	}
}

function updateStructure(prop, val) {
	requestObj[prop] = val;
	btnsunMore.dataset[prop] = val;
}

function createContent(module, view, item) {
	let newsDate = new Date(item.news_pub_date).toLocaleDateString(
		"us-en",
		blogDateOptions
	);
	let image = "";
	if (item.images) {
		image = item.images[0].image;
	}
	switch (module) {
		case "blog":
			let title = item.heading || item.news_title;

			return `
					
					
					<div class="${classBase}__content ${classBase}__content--${view}">
						<div class="${classBase}__title ${classBase}__title--${view}">${title}</div>
						<div class="${classBase}__date ${classBase}__date--${view}">${newsDate}</div>
						<div class="${classBase}__summary ${classBase}__summary--${view}">${
				item.news_summary
			}</div>
					</div>
					<div class="${classBase}__more ${classBase}__more--${view}">
						<a class="${classBase}__link ${classBase}__link--${view} sun-btn sun-btn--primary" href="${
				item.url
			}" ${item.url.includes("://") ? `target="_blank"` : ``}>
							<span class="${classBase}__link-text">Read more &ellips;</span>
						</a>
					</div>
				`;
			break;

		case "offers":
			let end_date = new Date(item.end_date).toLocaleDateString(
				"us-en",
				offersDateOptions
			);

			return `
				<div class="${classBase}__image ${classBase}__image--${view}">
					${
						image
							? `<img class="${classBase}__img ${classBase}__img--${view}" src="${image.file_location}" alt="${image.caption}" />`
							: ``
					}
				</div>
				<div class="${classBase}__content">
					<div class="${classBase}__content-contain">
						<div class="${classBase}__content-title">${item.text_title}</div>
						<div class="${classBase}__content-desc">${item.text_description}</div>
					</div>
					<div class="${classBase}__content-outro msf-fx msf-fx--ai-c">
						<div class="${classBase}__content-print">
							<button type="button" onclick="">
								<svg viewBox="0 0 512 512" width="40" height="40" class="msicon msicon--fa-fas-print">
									<path d="M448 192V77.25c0-8.49-3.37-16.62-9.37-22.63L393.37 9.37c-6-6-14.14-9.37-22.63-9.37H96C78.33 0 64 14.33 64 32v160c-35.35 0-64 28.65-64 64v112c0 8.84 7.16 16 16 16h48v96c0 17.67 14.33 32 32 32h320c17.67 0 32-14.33 32-32v-96h48c8.84 0 16-7.16 16-16V256c0-35.35-28.65-64-64-64zm-64 256H128v-96h256v96zm0-224H128V64h192v48c0 8.84 7.16 16 16 16h48v96zm48 72c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z" />
								</svg>
							</button>
						</div>
						<div class="${classBase}__content-fine">
							${
								item.end_date
									? `<div class="${classBase}__content-expires">Expires ${end_date}</div>`
									: ``
							}
							${
								item.text_disclaimer
									? `<div class="${classBase}__content-disclaimer">${item.text_disclaimer}</div>`
									: ``
							}
						</div>
					</div>
				</div>
			`;

			break;
		case "gallery":
			if (item.images === undefined) {
				return "";
			}
			const images = {};
			item.images.forEach((item) => {
				images[item.image.purpose ? item.image.purpose : "default"] =
					item.image.file_location;
			});

			return `<a href="${
				images.Full ? images.Full : images.default
			}" class="sun-gallery__link" title="${item.title}" data-title="${
				item.title
			} data-desc="${item.description ? item.description : " "}">
							<div class="sun-gallery__image sun-gallery__image--listing">
								<img class="sun-gallery__img sun-gallery__img--listing" alt="${
									item.title
								}" src="${
				images.Listing ? images.Listing : images.default
			}" />
                            </div>
							<div class="sun-gallery__content">
							${
								item.title
									? `
                                <div class="sun-gallery__title">${item.title}</div>`
									: ""
							}
                            </div>
                        </a>`;
			break;
		case "testimonials":
			let testimonialsDate = new Date(item.date).toLocaleDateString(
				"us-en",
				testimonialsDateOptions
			);
			const imgSrc = item.images
				? item.images[0].image.file_location
				: "/skins/sun20/assets/img/testimonial-placeholder.png";
			return `
					<div class="sun-testimonials__image">
						<img class="sun-testimonials__img" src="${imgSrc}" alt="${item.name}" />
					</div>
					<div class="sun-testimonials__content">
						<div class="sun-testimonials__description">${item.description}</div>
						<div class="sun-testimonials__title">${item.name}</div>
					</div>
			`;
			break;
	}
}
