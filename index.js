class Producto {
  constructor(nombre, precio, imagen) {
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
    this.cantidad = 1;
  }
}

class Carrito {
  constructor() {
    this.productos = this.cargarDesdeStorage();
    this.totalConDescuento = 0;
    this.mostrarProductos();
  }

  cargarDesdeStorage() {
    const storedCarrito = localStorage.getItem("carrito");
    return storedCarrito ? JSON.parse(storedCarrito) : [];
  }

  guardarEnStorage() {
    localStorage.setItem("carrito", JSON.stringify(this.productos));
  }

  agregarProducto(producto) {
    const existingProduct = this.productos.find(
      (p) => p.nombre === producto.nombre
    );
    if (existingProduct) {
      existingProduct.cantidad += 1;
    } else {
      this.productos.push(producto);
    }
    this.guardarEnStorage();
    this.mostrarProductos();
    this.calcularTotal();
  }

  aumentarCantidad(index) {
    this.productos[index].cantidad += 1;
    this.guardarEnStorage();
    this.mostrarProductos();
    this.calcularTotal();
  }

  disminuirCantidad(index) {
    if (this.productos[index].cantidad > 1) {
      this.productos[index].cantidad -= 1;
    } else {
      this.productos.splice(index, 1);
    }
    this.guardarEnStorage();
    this.mostrarProductos();
    this.calcularTotal();
  }

  mostrarProductos() {
    const listaProductos = document.getElementById("lista-productos");
    listaProductos.innerHTML = "";
    this.productos.forEach((producto, index) => {
      const template = document
        .getElementById("template-carrito")
        .content.cloneNode(true);
      template.querySelector(".nombre").textContent = producto.nombre;
      template.querySelector(".cantidad").textContent = producto.cantidad;
      template.querySelector(".precio").textContent = `$${(
        producto.precio * producto.cantidad
      ).toFixed(2)}`;

      const btnAumentar = template.querySelector(".btn-aumentar");
      const btnDisminuir = template.querySelector(".btn-disminuir");

      btnAumentar.onclick = () => this.aumentarCantidad(index);
      btnDisminuir.onclick = () => this.disminuirCantidad(index);

      listaProductos.appendChild(template);
    });
  }

  calcularTotal() {
    const total = this.productos.reduce(
      (sum, producto) => sum + producto.precio * producto.cantidad,
      0
    );
    document.getElementById("total").textContent = total.toFixed(2);
    return total.toFixed(2);
  }

  aplicarDescuento(codigo) {
    if (!codigo) {
      alert("Debe ingresar un código");
    } else {
      const descuento = codigo === "DESCUENTO10" ? 0.1 : 0;
      const total = this.calcularTotal();
      this.totalConDescuento = total - total * descuento;
      document.getElementById("total").textContent =
        this.totalConDescuento.toFixed(2);
      alert(
        descuento > 0
          ? `Descuento aplicado: ${descuento * 100}%`
          : "Código inválido"
      );
    }
  }

  finalizarCompra() {
    if (this.productos.length > 0) {
      alert(
        `Compra finalizada. Total: $${
          this.totalConDescuento > 0
            ? this.totalConDescuento
            : this.calcularTotal()
        }`
      );
      this.totalConDescuento = 0;
      this.productos = [];
      document.getElementById("descuento").value = "";
      this.guardarEnStorage();
      this.mostrarProductos();
      this.calcularTotal();
    } else {
      alert("El carrito está vacío.");
    }
  }
}

const stock = [
  new Producto(
    "🍐 Pera",
    1.5,
    "https://images.unsplash.com/photo-1421167418805-7f170a738eb4?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ),
  new Producto(
    "🍍 Piña",
    1.0,
    "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ),
  new Producto(
    "🍓 Fresa",
    2.0,
    "https://plus.unsplash.com/premium_photo-1724256148318-388029ff4dd4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ),
  new Producto(
    "🥦 Brócoli",
    1.8,
    "https://images.unsplash.com/photo-1702491551498-37de8ab8396a?q=80&w=1675&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ),
  new Producto(
    "🥕 Zanahoria",
    0.9,
    "https://plus.unsplash.com/premium_photo-1724849305142-498abc1f7b89?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ),
  new Producto(
    "🍅 Tomate",
    1.2,
    "https://images.unsplash.com/photo-1517666005606-69dea9b54865?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ),
];

const carrito = new Carrito();

const productosLista = document.getElementById("productos-lista");
stock.forEach((producto) => {
  const col = document.createElement("div");
  col.classList.add("col-md-6", "producto");
  col.innerHTML = `
        <div class="card mt-3">
            <img src="${producto.imagen}" class="card-img-top img" alt="${
    producto.nombre
  }">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
                <button class="btn btn-primary agregar" data-nombre="${
                  producto.nombre
                }" data-precio="${producto.precio}">Agregar al Carrito</button>
            </div>
        </div>
    `;
  productosLista.appendChild(col);
});

document.querySelectorAll(".agregar").forEach((boton) => {
  boton.addEventListener("click", (event) => {
    const nombre = event.target.dataset.nombre;
    const precio = parseFloat(event.target.dataset.precio);
    carrito.agregarProducto(new Producto(nombre, precio, ""));
  });
});

document.getElementById("aplicar-descuento").addEventListener("click", () => {
  const codigo = document.getElementById("descuento").value;
  carrito.aplicarDescuento(codigo);
});

document.getElementById("finalizar-compra").addEventListener("click", () => {
  carrito.finalizarCompra();
});
