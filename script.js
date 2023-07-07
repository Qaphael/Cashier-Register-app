// Define totalCell globally, so it can be accessed within the entire script
var totalCell = document.getElementById("totalAmount");

// Load previously saved items from local storage
window.addEventListener("DOMContentLoaded", function () {
  var savedItems = JSON.parse(localStorage.getItem("cashierRegisterItems"));
  if (savedItems) {
    savedItems.forEach(function (item) {
      addTableRow(item);
    });
    updateTotalAmount();
  }
});

function addItem() {
  var productName = document.getElementById("productName").value;
  var openingStock = parseInt(document.getElementById("openingStock").value);
  var rate = parseFloat(document.getElementById("rate").value);

  var errorContainer = document.getElementById("errorContainer");
  errorContainer.innerHTML = "";

  if (!productName || !openingStock || !rate) {
    errorContainer.innerHTML =
      "<p class='error'>Please fill in all fields.</p>";
    return;
  }

  var counter = 0;
  var closingStock = openingStock - counter;
  var subtotal = counter * rate;

  var item = {
    productName: productName,
    openingStock: openingStock,
    closingStock: closingStock,
    counter: counter,
    rate: rate,
    subtotal: subtotal,
  };

  addTableRow(item);
  updateTotalAmount();
  saveItemsToLocalStorage();

  // Clear input fields
  document.getElementById("productName").value = "";
  document.getElementById("openingStock").value = "";
  document.getElementById("rate").value = "";
}

function addTableRow(item) {
  var tableBody = document.querySelector("#registerTable tbody");
  var row = tableBody.insertRow();

  var cell1 = row.insertCell();
  var cell2 = row.insertCell();
  var cell3 = row.insertCell();
  var cell4 = row.insertCell();
  var cell5 = row.insertCell();
  var cell6 = row.insertCell();
  var cell7 = row.insertCell();
  var cell8 = row.insertCell();
  var cell9 = row.insertCell();

  var rowNumber = tableBody.rows.length;

  cell1.textContent = rowNumber;

  // Create input fields for product name and opening stock
  var productNameInput = document.createElement("input");
  productNameInput.className = "no-underline";
  productNameInput.type = "text";
  productNameInput.value = item.productName;
  productNameInput.addEventListener("change", function () {
    // Update the item object when the input value changes
    item.productName = productNameInput.value;
  });
  cell2.appendChild(productNameInput);

  var openingStockInput = document.createElement("input");
  openingStockInput.className = "no-underline";
  openingStockInput.type = "number";
  openingStockInput.min = "0";
  openingStockInput.value = item.openingStock;
  openingStockInput.addEventListener("change", function () {
    // Update the item object when the input value changes
    item.openingStock = openingStockInput.value;
  });
  cell3.appendChild(openingStockInput);

  cell4.textContent = item.closingStock;

  var counterDiv = document.createElement("div");
  counterDiv.className = "counter";
  cell5.appendChild(counterDiv);

  var decreaseButton = document.createElement("button");
  decreaseButton.textContent = "-";
  decreaseButton.addEventListener("click", function () {
    decreaseCounter(decreaseButton, item.openingStock);
  });
  counterDiv.appendChild(decreaseButton);

  var counterSpan = document.createElement("span");
  counterSpan.textContent = item.counter;
  counterDiv.appendChild(counterSpan);

  var increaseButton = document.createElement("button");
  increaseButton.textContent = "+";
  increaseButton.addEventListener("click", function () {
    increaseCounter(increaseButton, item.openingStock);
  });
  counterDiv.appendChild(increaseButton);

  cell6.textContent = item.rate;
  cell7.textContent = item.subtotal;

  var creditInput = document.createElement("input");
  creditInput.type = "number";
  creditInput.value = item.credit;
  creditInput.className = "credit-input";
  creditInput.addEventListener("change", function () {
    // Update the item object when the input value changes
    item.credit = creditInput.value;
    updateCredit(creditInput);
  });
  cell8.appendChild(creditInput);

  var removeButton = document.createElement("button");
  removeButton.className = "remove-button";
  removeButton.textContent = "X";
  removeButton.addEventListener("click", function () {
    removeItem(removeButton);
  });
  cell9.appendChild(removeButton);

  // Update the last row with the total amount
  var tableFooter = document.querySelector("#registerTable tfoot tr");
  var totalCell = tableFooter.querySelector("#totalAmount");
  totalCell.innerHTML = "Total: " + formatNumber(totalAmount);

  updateRowNumber();
  updateTotalAmount();
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateCredit(input) {
  var row = input.closest("tr");
  var credit = parseFloat(input.value);
  var subtotal = parseFloat(row.cells[6].textContent);

  var newSubtotal = subtotal - credit;
  if (newSubtotal >= 0) {
    row.cells[6].textContent = newSubtotal;
    updateTotalAmount();
    saveItemsToLocalStorage();
  } else {
    input.value = "0";
    alert("Credit cannot exceed Subtotal.");
  }
  saveItemsToLocalStorage(); // Save credit changes to local storage
}

// saveItemsToLocalStorage(); // Save credit changes to local storage

function increaseCounter(button, openingStock) {
  var cell = button.parentNode;
  var counterSpan = cell.querySelector("span");
  var counter = parseInt(counterSpan.textContent);
  counter++;
  counterSpan.textContent = counter;

  updateClosingStock(button, openingStock);
  updateSubtotal(button);
  updateTotalAmount();
  saveItemsToLocalStorage();
}

function decreaseCounter(button, openingStock) {
  var cell = button.parentNode;
  var counterSpan = cell.querySelector("span");
  var counter = parseInt(counterSpan.textContent);
  if (counter > 0) {
    counter--;
    counterSpan.textContent = counter;

    updateClosingStock(button, openingStock);
    updateSubtotal(button);
    updateTotalAmount();
    saveItemsToLocalStorage();
  }
}

function updateClosingStock(button, openingStock) {
  var row = button.closest("tr");
  var counter = parseInt(row.cells[4].querySelector("span").textContent);
  var closingStock = openingStock - counter;
  row.cells[3].textContent = closingStock;
}

function updateSubtotal(button) {
  var row = button.closest("tr");
  var counter = parseInt(row.cells[4].querySelector("span").textContent);
  var rate = parseFloat(row.cells[5].textContent);
  var subtotal = counter * rate;
  row.cells[6].textContent = subtotal;
}

function updateTotalAmount() {
  var totalAmount = 0;
  var table = document.getElementById("registerTable");
  for (var i = 1; i < table.rows.length - 1; i++) {
    // Exclude the footer row
    totalAmount += parseFloat(table.rows[i].cells[6].textContent);
  }
  totalCell.textContent = formatNumber(totalAmount);
}

function removeItem(button) {
  var row = button.closest("tr");
  // var table = row.parentNode;
  var table = document.getElementById("registerTable");
  table.deleteRow(row.rowIndex);
  updateRowNumber();
  updateTotalAmount();
  saveItemsToLocalStorage();
}

function updateRowNumber() {
  var table = document.getElementById("registerTable");
  var rows = table.rows;
  for (var i = 0; i < rows.length; i++) {
    rows[i].cells[0].textContent = i;
  }
}

function saveItemsToLocalStorage() {
  var table = document.getElementById("registerTable");
  var savedItems = [];
  for (var i = 1; i < table.rows.length - 1; i++) {
    // Exclude the header and footer rows
    var row = table.rows[i];
    var item = {
      productName: row.cells[1].querySelector("input").value,
      openingStock: parseInt(row.cells[2].querySelector("input").value),
      closingStock: parseInt(row.cells[3].textContent),
      counter: parseInt(row.cells[4].querySelector("span").textContent),
      rate: parseFloat(row.cells[5].textContent),
      subtotal: parseFloat(row.cells[6].textContent || 0), // Handle undefined or empty cells
      credit: parseFloat(row.cells[7].querySelector("input").value || 0), // Handle undefined or empty cells
    };
    savedItems.push(item);
  }
  localStorage.setItem("cashierRegisterItems", JSON.stringify(savedItems));
}

function saveAsPDF() {
  const table = document.getElementById("registerTable");

  // Remove the "Action" column header
  const actionColumnHeader =
    table.rows[0].cells[table.rows[0].cells.length - 1];
  actionColumnHeader.style.display = "none";

  // Remove the "Action" column from each row
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    row.deleteCell(row.cells.length - 1);
  }

  const opt = {
    margin: 10,
    filename: "cashier_register.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(table).save();

  // Delay before restoring the "Action" column
  const delay = 2000; // 2000 milliseconds (2 seconds)
  setTimeout(function () {
    // Restore the "Action" column header
    actionColumnHeader.style.display = "";

    // Restore the "Action" column in each row
    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const cell = row.insertCell(row.cells.length);
      cell.innerHTML = `<button class="remove-button" onclick="removeItem(this)">X</button>`;
    }
  }, delay);
}

// Global variable to store multiple summary tables
var summaryTables = [];

function generateSummary() {
  var summaryDate = document.getElementById("summaryDate").value;
  if (!summaryDate) {
    alert("Please select a date.");
    return;
  }

  var table = document.getElementById("registerTable");
  var summaryTable = document.createElement("table");
  summaryTable.id = "summaryTable";

  var summaryHeader = document.createElement("thead");
  var summaryHeaderRow = document.createElement("tr");
  var summarySubheadingCell = document.createElement("th");
  summarySubheadingCell.textContent = "Sales Date: " + summaryDate;
  summarySubheadingCell.className = "date";
  summarySubheadingCell.colSpan = table.rows[0].cells.length - 1; // Exclude the action column
  summaryHeaderRow.appendChild(summarySubheadingCell);
  summaryHeader.appendChild(summaryHeaderRow);
  summaryTable.appendChild(summaryHeader);

  var tableHeader = table.rows[0];
  var summaryHeaderRow = document.createElement("tr");

  // Exclude the action column
  for (var j = 1; j < tableHeader.cells.length - 1; j++) {
    var headerCell = document.createElement("th");
    headerCell.textContent = tableHeader.cells[j].textContent;
    summaryHeaderRow.appendChild(headerCell);
  }

  summaryHeader.appendChild(summaryHeaderRow);
  summaryTable.appendChild(summaryHeader);

  var summaryBody = document.createElement("tbody");

  var totalAmount = 0; // Variable to calculate the total amount

  for (var i = 1; i < table.rows.length - 1; i++) {
    var row = table.rows[i];

    // Retrieve input field values for product name and opening stock
    var productNameInput = row.cells[1].querySelector("input");
    var openingStockInput = row.cells[2].querySelector("input");
    var productName = productNameInput ? productNameInput.value : "";
    var openingStock = openingStockInput ? openingStockInput.value : "";

    // Exclude the action column
    var summaryRow = document.createElement("tr");
    for (var j = 1; j < row.cells.length - 1; j++) {
      var cell = row.cells[j];
      var summaryCell = document.createElement("td");

      // Insert product name in the "Product Name" column
      if (j === 1) {
        summaryCell.textContent = productName;
      }
      // Insert opening stock in the "Opening Stock" column
      else if (j === 2) {
        summaryCell.textContent = openingStock;
      }
      // Exclude the increment buttons in the quantity column
      else if (j !== 4) {
        summaryCell.textContent = cell.textContent;
      } else {
        // Include only the span element in the quantity column
        var quantitySpan = cell.querySelector("span");
        if (quantitySpan) {
          summaryCell.appendChild(quantitySpan.cloneNode(true));
        }
      }

      summaryRow.appendChild(summaryCell);
    }

    summaryBody.appendChild(summaryRow);

    // Add the subtotal value to the total amount
    var subtotalCell = row.cells[6];
    var subtotalValue = parseFloat(subtotalCell.textContent) || 0;
    totalAmount += subtotalValue;
  }

  summaryTable.appendChild(summaryBody);

  // Include the total row in the summary table
  var summaryFooter = document.createElement("tfoot");
  var summaryFooterRow = document.createElement("tr");

  var totalCell = document.createElement("td");
  totalCell.textContent = "Total";
  totalCell.colSpan = 5; // Span the total cell to cover 7 columns
  summaryFooterRow.appendChild(totalCell);

  var totalAmountCell = document.createElement("td");
  totalAmountCell.textContent = totalAmount.toFixed(2);
  summaryFooterRow.appendChild(totalAmountCell);
  totalAmountCell.colSpan = 2;

  summaryFooter.appendChild(summaryFooterRow);
  summaryTable.appendChild(summaryFooter);

  var summaryTableWrapper = document.createElement("div");
  summaryTableWrapper.classList.add("summary-table-wrapper");
  summaryTableWrapper.appendChild(summaryTable);

  // Create a delete button for the summary table
  var deleteButton = document.createElement("button");
  deleteButton.className = "btn";
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", function () {
    deleteSummaryTable(summaryTableWrapper);
  });

  summaryTableWrapper.appendChild(deleteButton);

  // Add the generated summary table to the array
  summaryTables.push(summaryTableWrapper.innerHTML);

  // Save all summary tables to local storage
  saveSummaryTableToLocalStorage();

  // Append the summary table wrapper to the summaryTableWrapper element
  var summaryTableWrapperElement = document.getElementById(
    "summaryTableWrapper"
  );
  summaryTableWrapperElement.appendChild(summaryTableWrapper);
}

function deleteSummaryTable(summaryTableWrapper) {
  var index = Array.from(summaryTableWrapper.parentNode.children).indexOf(
    summaryTableWrapper
  );
  summaryTableWrapper.parentNode.removeChild(summaryTableWrapper);
  summaryTables.splice(index, 1);
  saveSummaryTableToLocalStorage();
}

function saveSummaryTableToLocalStorage() {
  localStorage.setItem("summaryTables", JSON.stringify(summaryTables));
}

function loadSummaryTablesFromLocalStorage() {
  var summaryTablesString = localStorage.getItem("summaryTables");
  if (summaryTablesString) {
    summaryTables = JSON.parse(summaryTablesString);
    var summaryTableWrapperElement = document.getElementById(
      "summaryTableWrapper"
    );
    summaryTableWrapperElement.innerHTML = "";
    summaryTables.forEach(function (summaryTable) {
      var wrapper = document.createElement("div");
      wrapper.classList.add("summary-table-wrapper");
      wrapper.innerHTML = summaryTable;
      var deleteButton = wrapper.querySelector(".delete-button");
      deleteButton.addEventListener("click", function () {
        deleteSummaryTable(wrapper);
      });
      summaryTableWrapperElement.appendChild(wrapper);
    });
  }
}

// Call the function to load summary tables from local storage when the page loads
loadSummaryTablesFromLocalStorage();

function saveAs() {
  var element = document.getElementById("summaryTableWrapper");
  html2pdf(element);

  const summaryTable = summaryTableWrapper.getElementsByTagName("table")[0];

  // Remove the delete and save buttons from the summary table wrapper
  const deleteButton =
    summaryTableWrapper.getElementsByClassName("delete-button");
  for (let i = 0; i < deleteButton.length; i++) {
    deleteButton[i].style.display = "none";
  }

  var opt = {
    margin: 10,
    filename: "myfile.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  // New Promise-based usage:
  html2pdf().set(opt).from(element).save();

  // Delay before restoring the "delete" button
  const delay = 2000; // 2000 milliseconds (2 seconds)
  setTimeout(function () {
    // Restore the "delete button" in each table
    for (let i = 0; i < deleteButton.length; i++) {
      deleteButton[i].style.display = "";
    }
  }, delay);
}
