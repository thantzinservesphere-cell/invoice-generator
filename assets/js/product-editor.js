let nextProductId = 1;
let nextMetaId = 1;

let products = [
        {
            id: nextProductId++,
            name: "Online Purchase",
            qty: 1,
            amount: 100,
            gstRate: 5,
            meta: []
        }
    ];
    
    function addProduct() {

        products.push({
            id: nextProductId++,
            name: "Online purchase",
            qty: 1,
            amount: 100,
            gstRate: 5,
            meta: []
        });

        renderProductEditor();
        renderProducts();

    }


    function removeProduct(productId) {

        products = products.filter(product => product.id !== productId);

        renderProductEditor();
        renderProducts();

    }
    function updateProduct(id, key, value) {
        const product = products.find(p => p.id === id);

        if (!product) return;

        product[key] = value;

        renderProducts();
    }
    function addMeta(productId) {

        const product = products.find(p => p.id === productId);

        if (!product) return;

        product.meta.push({
            id: nextMetaId,
            label: "",
            value: ""
        });

        renderProductEditor();
        renderProducts();
    }

    function updateMeta(productId, metaId, key, value) {

        const product = products.find(p => p.id === productId);

        if (!product) return;

        const meta = product.meta.find(m => m.id === metaId);

        if (!meta) return;

        meta[key] = value;

        renderProducts();
    }

    function removeMeta(productId, metaId) {

        const product = products.find(p => p.id === productId);

        if (!product) return;

        product.meta = product.meta.filter(m => m.id !== metaId);

        renderProductEditor();
        renderProducts();

    }

    function renderProductEditor() {

        const container = document.getElementById("products-list");

        container.innerHTML = "";
        products.forEach(product => {

            const metaHtml = product.meta.map(meta => `
                <div class="meta-row flex gap-2 mt-2">

                    <input
                        type="text"
                        class="meta-label flex-1 rounded-lg border px-3 py-2"
                        placeholder="Label"
                        value="${meta.label}"
                        onchange="updateMeta('${product.id}','${meta.id}','label',this.value)">

                    <input
                        type="text"
                        class="meta-value flex-1 rounded-lg border px-3 py-2"
                        placeholder="Value"
                        value="${meta.value}"
                        onchange="updateMeta('${product.id}','${meta.id}','value',this.value)">

                    <button
                        type="button"
                        onclick="removeMeta('${product.id}','${meta.id}')"
                        class="rounded-lg bg-red-500 px-3 text-white">
                        ×
                    </button>

                </div>
            `).join("");

            container.insertAdjacentHTML("beforeend", `

                <div class="product-item rounded-lg border p-4 mb-4">
                    <div class="flex justify-end">
                        <button
                            type="button"
                            onclick="removeProduct(${product.id})"
                            class="size-8 rounded-full bg-red-600 text-white hover:bg-black transition">
                            x
                        </button>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-xs">Name</label>
                        <input
                            type="text"
                            class="w-full rounded-lg border px-3 py-2 mb-3"
                            placeholder="Product Name"
                            value="${product.name}"
                            onchange="updateProduct('${product.id}','name',this.value)">
                    </div>
                    
                    <div class="grid grid-cols-3 gap-3">
                        <div class="flex flex-col">
                            <label class="text-xs">QTY</label>
                            <input
                                type="number"
                                class="rounded-lg border px-3 py-2"
                                value="${product.qty}"
                                placeholder="QTY"
                                onchange="updateProduct('${product.id}','qty',Number(this.value))">
                        </div>
                        <div class="flex flex-col">
                            <label class="text-xs">Amount</label>
                            <input
                                type="number"
                                class="rounded-lg border px-3 py-2"
                                placeholder="Amount"
                                value="${product.amount}"
                                step="0.01"
                                onchange="updateProduct('${product.id}','amount',Number(this.value))">
                        </div>
                        <div class="flex flex-col">
                            <label class="text-xs">GST%</label>
                            <input
                                type="number"
                                class="rounded-lg border px-3 py-2"
                                placeholder="GST%"
                                value="${product.gstRate}"
                                onchange="updateProduct('${product.id}','gstRate',Number(this.value))">
                        </div>

                    </div>

                    <div class="mt-4">

                        ${metaHtml}

                        <button
                            type="button"
                            class="mt-3 rounded-lg border px-3 py-2 hover:bg-black hover:text-white"
                            onclick="addMeta('${product.id}')">
                            + Add Meta
                        </button>

                    </div>

                </div>

            `);

        });
    }

    function renderProducts() {

        const tbody = document.getElementById("invoice-items");

        tbody.innerHTML = "";

        products.forEach(product => {

            const taxable = product.amount / (1 + product.gstRate / 100);
            const gst = product.amount - taxable;

            const metaHtml = product.meta
                .filter(meta => meta.label && meta.value)
                .map(meta => `
                    <div>
                        <span class="font-medium">${meta.label}:</span>
                        ${meta.value}
                    </div>
                `)
                .join("");

            tbody.insertAdjacentHTML("beforeend", `

                <tr class="border-b border-gray-200 align-top">

                    <td class="px-4 py-3">

                        <div class="font-medium">
                            ${product.name || "Product"}
                        </div>

                        ${
                            metaHtml
                                ? `<div class="mt-1 text-xs text-gray-500 space-y-1">${metaHtml}</div>`
                                : ""
                        }

                    </td>

                    <td class="px-4 py-3 text-center">
                        ${product.qty}
                    </td>

                    <td class="px-4 py-3 text-right">
                        ₹${(taxable * product.qty).toFixed(2)}
                    </td>

                    <td class="px-4 py-3 text-center">
                        ${product.gstRate}%
                    </td>

                    <td class="px-4 py-3 text-right">
                        ₹${(gst * product.qty).toFixed(2)}
                    </td>

                    <td class="px-4 py-3 text-right font-medium">
                        ₹${(product.amount * product.qty).toFixed(2)}
                    </td>

                </tr>

            `);

        });
    }

renderProductEditor();
renderProducts();