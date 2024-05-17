const appRoot = document.getElementById("app-root");

const search = document.createElement('div')
search.classList.add('search')
appRoot.appendChild(search)

function getTable(currentTable) {
    const table = document.createElement('table');
    const thead = table.createTHead();
    const tbody = table.createTBody();
    const headers = ['country', 'flag', 'region', 'area', 'capital', 'languages'];
    const headerrow = thead.insertRow();
    headers.forEach(headertext => {
        const th = document.createElement('th');
        th.textContent = headertext;
        headerrow.appendChild(th);

        if (th.textContent === 'country') {
            th.appendChild(sortButton);
        }
        if (th.textContent === 'area') {
            th.appendChild(sortAreaButton);
        }
    });

    currentTable.forEach(country => {
        const row = tbody.insertRow();
        row.insertCell().textContent = country.name;
        const flagCell = row.insertCell();
        const flagImage = document.createElement('img');
        flagImage.src = country.flagURL;
        flagImage.alt = country.name + ' flag';
        flagCell.appendChild(flagImage);

        row.insertCell().textContent = country.region;
        row.insertCell().textContent = country.area;
        row.insertCell().textContent = country.capital;
        row.insertCell().textContent = Object.values(country.languages).join(', ');
    });

    const previousTable = document.getElementById('table');
    if (previousTable) {
        previousTable.remove();
    }

// Добавляем новую таблицу на страницу
    table.id = 'table';
    appRoot.appendChild(table);
}

const sortButton = document.createElement('button');
const arrowImage = document.createElement('img');
arrowImage.src = 'up_arrow.svg';
sortButton.alt = 'Sort by Name';
arrowImage.classList.add('sort-icon');
sortButton.appendChild(arrowImage);
search.appendChild(sortButton);

sortButton.addEventListener('click', function() {
    const table = document.getElementById('table');
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
        const nameA = a.cells[0].textContent.toUpperCase();
        const nameB = b.cells[0].textContent.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    rows.forEach(row => {
        tbody.appendChild(row);
    });
});

// Объявляем переменную для отслеживания текущего порядка сортировки
let sortOrder = 'asc'; // По умолчанию сортировка по возрастанию

// Добавляем обработчик события для кнопки сортировки
sortButton.addEventListener('click', function() {
    const table = document.getElementById('table');
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
        const nameA = a.cells[0].textContent.toUpperCase();
        const nameB = b.cells[0].textContent.toUpperCase();
        if (sortOrder === 'asc') {
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        } else {
            if (nameA > nameB) {
                return -1;
            }
            if (nameA < nameB) {
                return 1;
            }
            return 0;
        }
    });

    // Изменяем порядок сортировки для следующего нажатия
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    if(sortOrder === 'asc') {
        arrowImage.src = 'up_arrow.svg'; // Устанавливаем изображение стрелки вверх
    } else {
        arrowImage.src = 'down_arrow.svg'; // Устанавливаем изображение стрелки вниз
    }
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    rows.forEach(row => {
        tbody.appendChild(row);
    });
});
const sortAreaButton = document.createElement('button');
const arrowImageArea = document.createElement('img');
arrowImageArea.src = 'up_arrow.svg';
arrowImageArea.alt = 'Sort by Area';
arrowImageArea.classList.add('sort-icon');
sortAreaButton.appendChild(arrowImageArea);
search.appendChild(sortAreaButton);

sortAreaButton.addEventListener('click', function() {
    const table = document.getElementById('table');
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
        const areaA = parseFloat(a.cells[3].textContent);
        const areaB = parseFloat(b.cells[3].textContent);

        return areaA - areaB; // Сортировка по возрастанию
    });

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    rows.forEach(row => {
        tbody.appendChild(row);
    });
});
let ascendingOrder = true; // Переменная для отслеживания порядка сортировки

sortAreaButton.addEventListener('click', function() {
    const table = document.getElementById('table');
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
        const areaA = parseFloat(a.cells[3].textContent);
        const areaB = parseFloat(b.cells[3].textContent);

        if (ascendingOrder) {
            return areaA - areaB;
        } else {
            return areaB - areaA;
        }
    });

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    rows.forEach(row => {
        tbody.appendChild(row);
    });

    ascendingOrder = !ascendingOrder;

    if (ascendingOrder) {
        arrowImageArea.src = 'up_arrow.svg';
    } else {
        arrowImageArea.src = 'down_arrow.svg';
    }

})

const regionRadio = document.createElement('input');
regionRadio.setAttribute('type', 'radio');
regionRadio.setAttribute('name', 'searchType');
regionRadio.setAttribute('value', 'region');
search.appendChild(regionRadio);

const regionLabel = document.createElement('label');
regionLabel.textContent = 'Region';
regionLabel.setAttribute('for', 'region');
search.appendChild(regionLabel);

regionRadio.addEventListener('change', function() {
    if (regionRadio.checked) {
        const regions = externalService.getRegionsList(); // Получаем список регионов
        const selectElement = document.createElement('select');

        search.innerHTML = '';

        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            selectElement.appendChild(option);
        });

        selectElement.addEventListener('change', function() {
            const selectedLanguage = selectElement.value; // Получаем выбранный язык
            //alert(selectedLanguage); // Выводим выбранный язык в консоль
            getTable(externalService.getCountryListByRegion(selectedLanguage))
        });
        search.appendChild(regionRadio);
        search.appendChild(regionLabel);
        search.appendChild(languageRadio);
        search.appendChild(languageLabel);
        search.appendChild(selectElement);
    }
});

const languageRadio = document.createElement('input');
languageRadio.setAttribute('type', 'radio');
languageRadio.setAttribute('name', 'searchType');
languageRadio.setAttribute('value', 'language');
search.appendChild(languageRadio);
const languageLabel = document.createElement('label');
languageLabel.textContent = 'Language';
languageLabel.setAttribute('for', 'language');
search.appendChild(languageLabel);

languageRadio.addEventListener('change', function() {
    if (languageRadio.checked) {
        const languages = externalService.getLanguagesList(); // Получаем список языков
        const selectElement = document.createElement('select');

        search.innerHTML = '';

        languages.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            selectElement.appendChild(option);
        });

        selectElement.addEventListener('change', function() {
            const selectedLanguage = selectElement.value; // Получаем выбранный язык
            getTable(externalService.getCountryListByLanguage(selectedLanguage))
        });
        search.appendChild(regionRadio);
        search.appendChild(regionLabel);
        search.appendChild(languageRadio);
        search.appendChild(languageLabel);
        search.appendChild(selectElement);
    }
});

search.appendChild(regionRadio);
search.appendChild(regionLabel);
search.appendChild(languageRadio);
search.appendChild(languageLabel);

getTable(externalService.getAllCountries())

