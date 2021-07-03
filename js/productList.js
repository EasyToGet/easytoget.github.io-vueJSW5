import userProductModal from "../components/userProductModal.js";

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'easytoget';

const app = Vue.createApp({
  data() {
    return {
      // 讀取效果
      loadingStatus: {
        loadingItem: '',
      },
      // 產品列表
      products: [],
      // props 傳遞到內層的暫存資料
      product: {},
      // 表單結構
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      // 購物車列表
      cart: {},
    };
  },
  methods: {
    // 取得商品列表
    getProducts() {
      const api = `${apiUrl}/api/${apiPath}/products`;
      axios.get(api)
        .then((res) => {
          if (res.data.success) {
            console.log(res.data.products);
            this.products = res.data.products;
          } else {
            alert(res.data.message);
          }

        })
    },
    // 單一商品細節
    openModal(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/product/${item.id}`;
      axios.get(api)
        .then((res) => {
          if (res.data.success) {
            // console.log(res);
            this.product = res.data.product;
            this.loadingStatus.loadingItem = '';
            this.$refs.userProductModal.openModal();
          } else {
            alert(res.data.message);
          }

        })
    },
    // 加入購物車
    addCart(id, qty = 1) {
      this.loadingStatus.loadingItem = id;
      const api = `${apiUrl}/api/${apiPath}/cart`;
      const cart = {
        product_id: id,
        qty,
      };

      this.$refs.userProductModal.hideModal();
      axios.post(api, { data: cart })
        .then(res => {
          if (res.data.success) {
            // console.log(res);
            alert(res.data.message);
            this.loadingStatus.loadingItem = '';
            this.getCart();
          } else {
            alert(res.data.message);
          }

        })
    },
    // 更新購物車
    updateCart(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      const cart = {
        product_id: item.product.id,
        qty: item.qty,
      }
      // console.log(cart, api);
      axios.put(api, { data: cart })
        .then(res => {
          if (res.data.success) {
            // console.log(res);
            alert(res.data.message);
            this.loadingStatus.loadingItem = '';
            this.getCart();
          } else {
            alert(res.data.message);
            this.loadingStatus.loadingItem = '';
          }
        })
    },
    // 刪除某一筆購物車資料
    removeCartItem(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/api/${apiPath}/cart/${item.id}`;

      axios.delete(api)
        .then(res => {
          if (res.data.success) {
            alert(res.data.message);
            this.loadingStatus.loadingItem = '';
            this.getCart();
          } else {
            alert(res.data.message);
          }
        })
    },
    // 刪除全部購物車
    deleteAllCarts() {
      const api = `${apiUrl}/api/${apiPath}/carts`;
      
      axios.delete(api)
        .then(res => {
          if (res.data.success) {
            alert(res.data.message);
            this.getCart();
          } else {
            alert(res.data.message);
          }
        })
    },
    // 取得購物車列表
    getCart() {
      const api = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(api)
        .then(res => {
          if (res.data.success) {
            console.log(res.data.data);
            this.cart = res.data.data;
          } else {
            alert(res.data.message);
          }
        })
    },
    // 結帳頁面
    createOrder() {
      const api = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form; 

      axios.post(api, { data: order })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            this.$refs.form.resetForm(); // 清除 user 個人資料表單
            this.resetFormUser();
            this.getCart();
          } else {
            alert(res.data.message);
          }
        })
    },
    // 收件人電話號碼驗證
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
    resetFormUser() {
      this.form.user.email = '';
      this.form.user.name = '';
      this.form.user.tel = '';
      this.form.user.address = '';
      this.form.message = '';
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.component('userProductModal', userProductModal);

app.mount('#app');