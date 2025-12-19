import { forwardRef, useMemo, useState } from "react";
import axios from "axios";



const BASE_PRICE = 85.5;
const EXTRA_PRICE = 5;

const TOPPINGS = [
  "Pepperoni",
  "Tavuk Izgara",
  "Mısır",
  "Sarımsak",
  "Ananas",
  "Sosis",
  "Soğan",
  "Sucuk",
  "Biber",
  "Kabak",
  "Kanada Jambonu",
  "Domates",
  "Jalepeno",
  "Salam",
];

const OrderForm = forwardRef(function OrderForm({ onSuccess }, ref) {

  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [dough, setDough] = useState("");
  const [toppings, setToppings] = useState([]);
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const nameOk = name.trim().length >= 3;
  const sizeOk = size !== "";
  const doughOk = dough !== "";
  const toppingsOk = toppings.length >= 4 && toppings.length <= 10;

  const selectionsTotalPerPizza = useMemo(
  () => toppings.length * EXTRA_PRICE,
  [toppings]
);

const selectionsTotal = useMemo(
  () => selectionsTotalPerPizza * qty,
  [selectionsTotalPerPizza, qty]
);

const total = useMemo(
  () => (BASE_PRICE * qty) + selectionsTotal,
  [selectionsTotal, qty]
);


  const formValid = nameOk && sizeOk && doughOk && toppingsOk && !loading;

  const toggleTopping = (t) => {
    setToppings((prev) => {
      if (prev.includes(t)) return prev.filter((x) => x !== t);
      if (prev.length >= 10) return prev; 
      return [...prev, t];
    });
  };

  const decQty = () => setQty((q) => (q > 1 ? q - 1 : 1));
  const incQty = () => setQty((q) => q + 1);

  const submit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    const payload = {
      name: name.trim(),
      size,
      dough,
      toppings,
      note: note.trim(),
      qty,
      basePrice: BASE_PRICE,
      extraPrice: EXTRA_PRICE,
      selectionsTotal,
      total,
    };

    try {
      setLoading(true);
      const res = await axios.post("https://reqres.in/api/pizza", payload, {
        headers: {
          "x-api-key": "reqres-free-v1",
          "Content-Type": "application/json",
        },
      });

      console.log("✅ API Response:", res.data);
      console.log("🧾 Sipariş Özeti:", { ...payload, ...res.data });
      onSuccess?.();
    } catch (err) {
      console.log("❌ API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} className="orderPage">
   
      <header className="orderTopbar">
        <h1 className="orderBrand">Teknolojik Yemekler</h1>
        <p className="orderCrumb">
          Anasayfa - <b>Sipariş Oluştur</b>
        </p>
      </header>

     
      <main className="orderWrap">
        <form className="orderCard" onSubmit={submit}>
          <h2 className="pizzaTitle">Position Absolute Acı Pizza</h2>

          <div className="pizzaMeta">
            <div className="pizzaPrice">{BASE_PRICE.toFixed(2)}₺</div>
            <div className="pizzaRate">
              <span className="rateNum">4.9</span>
              <span className="rateCount">(200)</span>
            </div>
          </div>

          <p className="pizzaDesc">
            Frontent Dev olarak hala position:absolute kullanıyorsan bu çok acı pizza tam sana göre. Pizza, domates, peynir ve genellikle çeşitli diğer malzemelerle kaplanmış, daha sonra geleneksel olarak odun ateşinde bir fırında yüksek sıcaklıkta pişirilen, genellikle yuvarlak, düzleştirilmiş mayalı buğday bazlı hamurdan oluşan İtalyan kökenli lezzetli bir yemektir. . Küçük bir pizzaya bazen pizzetta denir.
          </p>

          
          

         
          <div className="twoCols">
            <div className="colBox">
              <h3 className="secTitle">
                Boyut Seç <span className="req">*</span>
              </h3>

              {["Küçük", "Orta", "Büyük"].map((s) => (
                <label key={s} className="radioRow">
                  <input
                    type="radio"
                    name="size"
                    value={s}
                    checked={size === s}
                    onChange={() => setSize(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}

              {!sizeOk && <p className="fieldError">Boyut seçmelisin.</p>}
            </div>

            <div className="colBox">
              <h3 className="secTitle">
                Hamur Seç <span className="req">*</span>
              </h3>

              <select
                className="selectInput"
                value={dough}
                onChange={(e) => setDough(e.target.value)}
              >
                <option value="" disabled>
                  Hamur Kalınlığı
                </option>
                <option value="İnce">İnce</option>
                <option value="Orta">Orta</option>
                <option value="Kalın">Kalın</option>
              </select>

              {!doughOk && <p className="fieldError">Hamur seçmelisin.</p>}
            </div>
          </div>

          
          <div className="toppingsBlock">
            <h3 className="secTitle">Ek Malzemeler</h3>
            <p className="secHelp">En Fazla 10 malzeme seçebilirsiniz. 5₺</p>

            <div className="toppingsGrid">
              {TOPPINGS.map((t) => {
                const checked = toppings.includes(t);
                const disabled = !checked && toppings.length >= 10;

                return (
                  <label
                    key={t}
                    className={`checkRow ${disabled ? "isDisabled" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleTopping(t)}
                    />
                    <span>{t}</span>
                  </label>
                );
              })}
            </div>

            {!toppingsOk && (
              <p className="fieldError">
                Malzeme seçimi min 4 - max 10 olmalı. (Şu an: {toppings.length})
              </p>
            )}
          </div>

          
          <div className="fieldBlock">
            <label className="fieldLabel">
              İsim Soyisim <span className="req">*</span>
            </label>
            <input
              className="textInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="En az 3 karakter"
            />
            {!nameOk && name.length > 0 && (
              <p className="fieldError">İsim en az 3 karakter olmalı.</p>
            )}
          </div>


          <div className="noteBlock">
            <h3 className="secTitle">Sipariş Notu</h3>
            <input
              className="noteInput"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Siparişine eklemek istediğin bir not var mı?"
            />
          </div>

          <hr className="splitLine" />

          
          <div className="bottomRow">
            <div className="qtyBox">
              <button type="button" className="qtyBtn" onClick={decQty}>
                -
              </button>
              <div className="qtyValue">{qty}</div>
              <button type="button" className="qtyBtn" onClick={incQty}>
                +
              </button>
            </div>

            <div className="summaryBox">
              <div className="summaryCard">
                <h3 className="summaryTitle">Sipariş Toplamı</h3>

                <div className="sumLine">
                  <span>Seçimler</span>
                  <span>{selectionsTotal.toFixed(2)}₺</span>
                </div>

                <div className="sumLine sumTotal">
                  <span>Toplam</span>
                  <span>{total.toFixed(2)}₺</span>
                </div>
              </div>

              <button className="orderBtn" type="submit" disabled={!formValid}>
                {loading ? "GÖNDERİLİYOR..." : "SİPARİŞ VER"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </section>
  );
});




export default OrderForm;
