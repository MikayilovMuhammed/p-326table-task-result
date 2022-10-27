// General iterations
const useIterations = () => {
  const sortedArray = () => {
    let isSorted = false;
    sort.addEventListener("click", function () {
      isSorted = !isSorted;

      if (isSorted) {
        inputValues.sort(function (a, b) {
          if (a.productName < b.productName) {
            return -1;
          }
          if (a.productName > b.productName) {
            return 1;
          }
          return 0;
        });
        sortContent.innerText = "AtoZ";
      } else {
        sortContent.innerText = "ZtoA";
        inputValues.reverse();
      }
      thead();
      tbody(inputValues);
    });
  };

  const filteredPriceArray = () => {
    filterBtn.addEventListener("click", function () {
      let a = inputValues.filter(
        (item) =>
          Number(item.productPrice) > Number(filterInp[0].value) &&
          Number(item.productPrice) < Number(filterInp[1].value)
      );
      thead();
      if (a.length) {
        tbody(a);
      } else if (filterInp[0].value && filterInp[1].value) {
        tbody();
      } else {
        tbody(inputValues);
      }
    });
  };

  const filteredCategoryArray = () => {
    filterSelect.innerHTML = ` <option selected>Default value</option>`;
    categories.forEach(({ productCategory }) => {
      filterSelect.innerHTML += `
            productCategory<option value="${productCategory}">${productCategory}</option>
            `;
    });

    filterSelect.onchange = (e) => {
      let a = inputValues.filter(
        (item) => item.productCategory === e.target.value
      );
      thead();
      if (a.length) {
        tbody(a);
      } else {
        tbody(inputValues);
      }
    };
  };

  const searhedArray = () => {
    let searchResult = "";
    search.onchange = (e) => {
      searchResult = e.target.value;
    };

    searchForm.onsubmit = (e) => {
      e.preventDefault();

      const searchedArr = [];

      let findedItem = inputValues.find(
        (item) => item.productName === searchResult
      );

      findedItem && searchedArr.push(findedItem);
      thead();
      if (searchedArr.length) {
        tbody(searchedArr);
      } else if (!findedItem && searchResult) {
        tbody();
      } else {
        tbody(inputValues);
      }
    };
  };

  return {
    sortedArray,
    filteredPriceArray,
    filteredCategoryArray,
    searhedArray,
  };
};

// Variables
const btn = document.querySelector(".btn");
const inputs = document.querySelectorAll("input[name]");
const table = document.querySelector(".table");
const sort = document.querySelector(".sort");
const sortContent = document.querySelector(".sort span");
const filter = document.querySelector(".filter");
const filterBtn = document.querySelector(".filtered");
const filterInp = document.querySelectorAll(".filter input");
const filterCategory = document.querySelector(".filter-category");
const filterSelect = document.querySelector(".filter-category select");
const searchbar = document.querySelector(".searchbar");
const search = document.querySelector("#search");
const searchForm = document.querySelector("form");

// States
let inputState = {};
const categories = [];
const inputValues = [];

// Hooks
const { sortedArray, filteredPriceArray, filteredCategoryArray, searhedArray } =
  useIterations();

// Validations
const useValidations = () => {
  const checkIsEnteredProductInputs = () => {
    let isBreakValidation = false;
    inputs.forEach(({ name, value }) => {
      if (!value.trim().length) {
        alert(`Please enter ${name}`);
        isBreakValidation = true;
        return isBreakValidation;
      }
    });
    return isBreakValidation;
  };

  const checkHasProductName = (input) => {
    let hasProductName = inputValues.some(
      (item) =>
        item.productName.toLowerCase() === input.value.trim().toLowerCase()
    );

    if (hasProductName) {
      alert("Product already exist");
      return true;
    }
    return false;
  };

  const addProductCount = (input) => {
    let hasProductName = inputValues.some(
      (item) =>
        item.productName.toLowerCase() === input.value.trim().toLowerCase()
    );

    if (hasProductName) {
      alert(`Product already exist. Thats why add ${input.value} count`);
      incrementProductCount();
      return true;
    }
    return false;
  };

  const checkPriceIsNumber = () => {
    if (isNaN(inputs[1].value)) {
      alert("Please enter only number");
      return true;
    }
    return false;
  };

  const checkHasProductCategory = () => {
    const hasProductCategory = inputValues.some(
      ({ productCategory }) => productCategory === inputs[2].value
    );

    if (!hasProductCategory) {
      categories.push({ productCategory: inputs[2].value.trim() });
    }
  };

  return {
    checkIsEnteredProductInputs,
    checkHasProductName,
    checkPriceIsNumber,
    checkHasProductCategory,
    addProductCount,
  };
};

const callAllValidations = (input) => {
  const {
    checkIsEnteredProductInputs,
    // checkHasProductName,
    addProductCount,
    checkPriceIsNumber,
    checkHasProductCategory,
  } = useValidations();

  if (
    // checkHasProductName(input) || If without counter ||
    checkIsEnteredProductInputs() ||
    checkPriceIsNumber() ||
    checkHasProductCategory() ||
    addProductCount(input) // if with counter
  ) {
    return true;
  }

  return false;
};

// Set inputState
inputs.forEach((input) => {
  input.onchange = (e) => {
    const { name, value } = e.target;
    inputState = {
      ...inputState,
      number: inputValues.length + 1,
      productCount: 1,
      [name]: value,
    };
  };
});

// Add new items
btn.addEventListener("click", (e) => {
  e.preventDefault();

  if (callAllValidations(inputs[0])) {
    return;
  }

  showTable();
  thead();
  tbody(inputValues);
  changeProductName();

  sortedArray();
  filteredPriceArray();
  filteredCategoryArray();
  searhedArray();

  inputs.forEach((input) => {
    input.value = "";
  });
});

function changeProductName() {
  const { checkHasProductName } = useValidations();
  const itemInput = document.querySelectorAll(".item-input");
  const inputsInTable = document.querySelectorAll(".item-input input");
  const editBtnInTable = document.querySelectorAll(".item-input button");
  document.querySelectorAll(".input-items").forEach((input, idx) => {
    input.addEventListener("click", function () {
      this.classList.add("d-none");
      itemInput[idx].classList.remove("d-none");
      inputsInTable[idx].value = this.innerText;

      inputsInTable[idx].onchange = (e) => {
        if (checkHasProductName(inputsInTable[idx])) {
          return;
        }
        this.innerText = e.target.value;
      };
      editBtnInTable[idx].onclick = (e) => {
        itemInput[idx].classList.add("d-none");
        this.classList.remove("d-none");
      };
    });
  });
}

const showTable = () => {
  table.classList.remove("d-none");
  sort.classList.remove("d-none");
  filter.classList.remove("d-none");
  filterCategory.classList.remove("d-none");
  searchbar.classList.remove("d-none");

  inputValues.push(inputState);

  inputValues.sort(function (a, b) {
    if (a.number < b.number) {
      return -1;
    }
    if (a.number > b.number) {
      return 1;
    }
    return 0;
  });
};

const thead = () => {
  table.innerHTML = `
    <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">Ad</th>
            <th scope="col">Qiymet</th>
            <th scope="col">Say</th>
            <th scope="col">Kategoriya</th>
        </tr>
    </thead>
  `;
};

const tbody = (inputValues) => {
  if (inputValues) {
    inputValues.forEach(
      (
        { number, productName, productPrice, productCategory, productCount },
        idx
      ) => {
        table.innerHTML += `
            <tr>
                <th scope="row">${number}</th>
                <td><span class="input-items">${productName}</span> <span class="d-none item-input"><input type="text" class=""> <button class="btn btn-info">Edit</button></span></td>
                <td>${productPrice} AZN</td>
                <td class="product-count">${productCount} AZN</td>
                <td>${productCategory}</td>
            </tr>
          `;
      }
    );
  } else {
    table.innerHTML += `
            <tr>
                <td><span class="input-items text-danger">Tapilmadi</span> <input type="text" class="d-none item-input"></td>
            </tr>
          `;
  }
};

function incrementProductCount() {
  let productCount = Number(document.querySelector(".product-count").innerText);
  productCount = isNaN(productCount) ? 1 : productCount;
  productCount++;
  document.querySelector(".product-count").innerText = productCount;
}

function incrementProductCountTwo() {
  let productCount = Number(document.querySelector(".product-count").innerText);
  productCount = isNaN(productCount) ? 1 : productCount;
  productCount++;
  document.querySelector(".product-count").innerText = productCount;
}
