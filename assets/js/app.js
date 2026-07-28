document.addEventListener("DOMContentLoaded", () => {
    const fields = document.querySelectorAll("[data-preview]");

    fields.forEach((field) => {
        const target = document.getElementById(field.dataset.preview);

        if (!target) return;

        const update = () => {
            let value = field.value.trim();

            if (field.type === "date" && value) {
                value = new Date(value).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                });
            }

            const row = document.getElementById(`${field.dataset.preview}-row`);

            if (value) {
                target.textContent = value;

                if (row) {
                    row.classList.remove("hidden");
                }
            } else {
                target.textContent = field.placeholder || "";

                if (row) {
                    row.classList.add("hidden");
                }
            }

            if (!value) {
                value = field.placeholder || "";
            }

            if (field.tagName === "TEXTAREA") {
                target.innerHTML = value.replace(/\n/g, "<br>");
            } else {
                target.textContent = value;
            }
        };

        field.addEventListener("input", update);
        field.addEventListener("change", update);

        // Initialize preview
        update();
    });

    const logoInput = document.getElementById("company-logo-input");
    const logoImage = document.getElementById("company-logo");

    if (logoInput && logoImage) {
        logoInput.addEventListener("change", (event) => {
            const file = event.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = (e) => {
                logoImage.src = e.target.result;
            };

            reader.readAsDataURL(file);
        });
    }

    const billingInput = document.getElementById("customer-address-input");
    const shippingInput = document.getElementById("shipping-address-input");

    const sameAsBilling = document.getElementById("same-as-billing");
    const showShippingInfo = document.getElementById("show-shipping-info");

    const shippingSection = document.getElementById("shipping-info-section");
    const billingHeader = document.getElementById("billing-header");

    // Same as Billing
    function syncShippingAddress() {
        if (!sameAsBilling.checked) {
            shippingInput.disabled = false;
            return;
        }

        shippingInput.value = billingInput.value;
        shippingInput.disabled = true;

        // Update live preview
        shippingInput.dispatchEvent(new Event("input"));
    }

    sameAsBilling.addEventListener("change", syncShippingAddress);

    billingInput.addEventListener("input", () => {
        if (sameAsBilling.checked) {
            shippingInput.value = billingInput.value;
            shippingInput.dispatchEvent(new Event("input"));
        }
    });

    // Show / Hide Shipping Info
    function toggleShippingSection() {
        shippingSection.hidden = !showShippingInfo.checked;
        billingHeader.hidden = !showShippingInfo.checked;
    }

    showShippingInfo.addEventListener("change", toggleShippingSection);

    // Initialize
    syncShippingAddress();
    toggleShippingSection();

});