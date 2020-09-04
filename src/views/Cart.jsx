import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeFromCart,
  clearCart,
  updateCartProductCount,
} from "../store/actions/shop";
import CartProduct from "../components/Cart/CartProducts";
import CartProductTotals from "../components/Cart/CartProductTotals";
import OrderSuccess from "../components/OrderSuccess";
import PropTypes from "prop-types";

class Cart extends Component {
  productCountHandler = (field_value, product_details) => {
    this.props.updateCartProductCountProp(field_value, product_details);
  };

  render() {
    let cartContent = null;
    let currencyKeys = Object.keys(this.props.usedCurrencyProp);
    let currencyValue = this.props.usedCurrencyProp[currencyKeys[0]];

    if (this.props.cartTotalProp > 0) {
      let cartPriceCountArray = [];
      let cartProducts = this.props.cartProductsProp.map(
        (productInCart, index) => {
          // fetch product information from source based on id
          // product information can also be stored in state
          let productFromStore = this.props.productProps.find(
            (product) => product.id === productInCart.id
          );
          cartPriceCountArray.push({
            price:
              productFromStore.quantity > 0
                ? Math.round(productFromStore.price * currencyValue)
                : 0,
            count: productInCart.quantity,
          });
          return (
            <CartProduct
              key={index}
              productId={productFromStore.id}
              productName={productFromStore.name}
              productVendor={productFromStore.vendor}
              productCategory={productFromStore.category}
              productPhoto={productFromStore.img}
              productPrice={Math.round(productFromStore.price * currencyValue)}
              productCount={productInCart.quantity}
              productSize={productInCart.size}
              productQuantity={productFromStore.quantity}
              updateProductCount={(event) =>
                this.productCountHandler(event.target.value, productInCart)
              }
              removeCartProduct={() =>
                this.props.removeProductFromCartProp(productInCart)
              }
              currency={this.props.usedCurrencyProp}
            />
          );
        }
      );

      let cartTotals = (
        <CartProductTotals
          subtotal={cartPriceCountArray.reduce(
            (acc, el) => acc + el.price * el.count,
            0
          )}
          vat={this.props.vatProp}
          clearCart={() => this.props.clearProductsFromCartProp()}
          currency={this.props.usedCurrencyProp}
        />
      );

      cartContent = (
        <React.Fragment>
          {cartProducts}
          {cartTotals}
        </React.Fragment>
      );
    } else if (this.props.cartTotalProp === 0 && this.props.orderSuccessProp) {
      cartContent = <OrderSuccess />;
    } else {
      cartContent = (
        <h5 className={"shop-empty-cart"}>
          Your cart is empty. <Link to={"/"}>Please fill it up.</Link>
        </h5>
      );
    }

    return (
      <div className="container shop-container py-4">
        <div className={"p-4 shop-div"}>{cartContent}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productProps: state.products,
    cartTotalProp: state.cartTotal,
    cartProductsProp: state.cart,
    vatProp: state.vat,
    orderSuccessProp: state.orderSuccess,
    usedCurrencyProp: state.usedCurrency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeProductFromCartProp: (productDetails) =>
      dispatch(removeFromCart(productDetails)),
    clearProductsFromCartProp: () => dispatch(clearCart()),
    updateCartProductCountProp: (value, productDetails) =>
      dispatch(updateCartProductCount(Number(value), productDetails)),
  };
};

Cart.propTypes = {
  cartTotalProp: PropTypes.number.isRequired,
  cartProductsProp: PropTypes.array.isRequired,
  productProps: PropTypes.array.isRequired,
  orderSuccessProp: PropTypes.bool.isRequired,
  vatProp: PropTypes.number,
  usedCurrencyProp: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
