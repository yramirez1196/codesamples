import * as React from "react";
import clsx from "clsx";
import $ from "jquery";
import { useToasts } from "react-toast-notifications";
/* import { useForm } from 'react-hook-form'; */
import { Button } from "components/common/button/button";
import { BraintreeApiServices } from "api/braintree";
import { Loading } from "components/loading";

type BraintreeCustomFormProps = {
  onHandleSubmit: (data: any) => void;
};

const BraintreeCustomForm: React.FC<BraintreeCustomFormProps> = ({
  onHandleSubmit,
}) => {
  const { addToast } = useToasts();
  const [braintree, setBraintree] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [token, setToken] = React.useState<string>();
  /* 	const formRef = React.createRef<any>(); */

  React.useEffect(() => {
    BraintreeApiServices.getGenerateTokenBraintree()
      .then((response) => {
        const braintree: any = window;
        setToken(response.token);
        setBraintree(braintree.braintree);
      })
      .catch((e) => {
        console.log("error:", e);
      });
  }, []);
  React.useEffect(() => {
    console.log(braintree);
    if (braintree) renderPayment();
  }, [braintree]);

  const renderPayment = () => {
    // console.log('llega:', token);
    const form: any = document.querySelector("#my-sample-form");
    const submit: any = document.querySelector("#sendForm");
    braintree.client.create(
      {
        authorization: token,
      },
      function (err: any, clientInstance: any) {
        if (err) {
          addToast(err.message, { appearance: "error" });
          console.error(err);
          return;
        }

        // Create input fields and add text styles
        braintree.hostedFields.create(
          {
            client: clientInstance,
            styles: {
              input: {
                color: "#282c37",
                "font-size": "16px",
                transition: "color 0.1s",
                "line-height": "3",
              },
              // Style the text of an invalid input
              "input.invalid": {
                color: "red",
              },
              ".is-invalid": {
                "border-color": "#dc3545",
                "box-shadow": " 0 0 0 0.2rem rgba(220, 53, 69, 0.25)",
              },
              // placeholder styles need to be individually adjusted
              "::-webkit-input-placeholder": {
                color: "rgba(0,0,0,0.6)",
              },
              ":-moz-placeholder": {
                color: "rgba(0,0,0,0.6)",
              },
              "::-moz-placeholder": {
                color: "rgba(0,0,0,0.6)",
              },
              ":-ms-input-placeholder": {
                color: "rgba(0,0,0,0.6)",
              },
              // prevent IE 11 and Edge from
              // displaying the clear button
              // over the card brand icon
              "input::-ms-clear": {
                opacity: "0",
              },
            },
            // Add information for individual fields
            fields: {
              number: {
                selector: "#card-number",
                placeholder: "1111 1111 1111 1111",
                prefill: "5555555555554444",
              },
              cvv: {
                selector: "#cvv",
                placeholder: "400",
                prefill: "400",
              },
              expirationDate: {
                selector: "#expiration-date",
                placeholder: "08 / 2022",
                prefill: "08/2022",
              },
            },
          },
          function (err: any, hostedFieldsInstance: any) {
            if (err) {
              console.error(err);
              return;
            }

            /* 	hostedFieldsInstance.on('validityChange', function () { */
            // Check if all fields are valid, then show submit button
            /* 	var formValid = Object.keys(event.fields).every(function (key) {
								return event.fields[key].isValid;
							}); */

            // if (formValid) {
            // 	$('#button-pay').addClass('show-button');
            // } else {
            // 	$('#button-pay').removeClass('show-button');
            // }
            /* 				}); */

            hostedFieldsInstance.on("empty", function () {
              $("header").removeClass("header-slide");
              $("#card-image").removeClass();
              $(form).removeClass();
            });

            hostedFieldsInstance.on("cardTypeChange", function (event: any) {
              // Change card bg depending on card type
              if (event.cards.length === 1) {
                $(form).removeClass().addClass(event.cards[0].type);
                $("#card-image").removeClass().addClass(event.cards[0].type);
                $("header").addClass("header-slide");

                // Change the CVV length for AmericanExpress cards
                if (event.cards[0].code.size === 4) {
                  hostedFieldsInstance.setAttribute({
                    field: "cvv",
                    attribute: "placeholder",
                    value: "1234",
                  });
                }
              } else {
                hostedFieldsInstance.setAttribute({
                  field: "cvv",
                  attribute: "placeholder",
                  value: "123",
                });
              }
            });

            submit.addEventListener(
              "click",
              function (event: any) {
                event.preventDefault();
                let formIsInvalid = false;
                const state = hostedFieldsInstance.getState();
                console.log("aaaaa");

                // perform validations on the non-Hosted Fields
                // inputs
                // if (!validateEmail()) {
                // 	formIsInvalid = true;
                // }

                // Loop through the Hosted Fields and check
                // for validity, apply the is-invalid class
                // to the field container if invalid
                Object.keys(state.fields).forEach(function (field) {
                  if (state.fields[field].isEmpty) {
                    formIsInvalid = true;
                    addToast(`${field} is empty`, { appearance: "error" });
                  } else if (!state.fields[field].isValid) {
                    $(state.fields[field].container).addClass("is-invalid");
                    formIsInvalid = true;
                    addToast(`${field} is invalid`, { appearance: "error" });
                    console.log("el peo:", state.fields[field]);
                  }
                  console.log("el peo:", state.fields[field]);
                });

                if (formIsInvalid) {
                  // skip tokenization request if any fields are invalid
                  return;
                }
                hostedFieldsInstance.tokenize(async function (
                  err: any,
                  payload: any
                ) {
                  if (err) {
                    console.error(err);
                    return;
                  }

                  // This is where you would submit payload.nonce to your server
                  // alert('Submit your nonce to your server here!');
                  setLoading(true);
                  await onHandleSubmit(payload);
                  setLoading(false);
                });
              },
              false
            );
          }
        );

        setLoading(false);
      }
    );
  };

  return (
    <>
      {loading && <Loading isSmall></Loading>}
      <div className={clsx("form-container", { invisible: loading })}>
        <form id="my-sample-form" className="scale-down">
          <div className="cardinfo-card-number">
            <label className="cardinfo-label font-bold" htmlFor="card-number">
              Card Number
            </label>
            <div className="input-wrapper" id="card-number"></div>
            <div id="card-image"></div>
          </div>

          <div className="cardinfo-wrapper">
            <div className="cardinfo-exp-date">
              <label
                className="cardinfo-label font-bold"
                htmlFor="expiration-date"
              >
                Expiration Date
              </label>
              <div className="input-wrapper" id="expiration-date"></div>
            </div>

            <div className="cardinfo-cvv">
              <label className="cardinfo-label font-bold" htmlFor="cvv">
                CVV
              </label>
              <div className="input-wrapper" id="cvv"></div>
            </div>
          </div>
        </form>
        <div className="mt-2 mb-6 w-full flex justify-center gap-x-8">
          <Button
            className={`py-3 px-8   bg-red-1 `}
            labelProps={"f-18 leading-4 text-white font-bold"}
            label="Cancel"
            href={"/marketPlace"}
          />
          <Button
            className={`py-3 px-8   bg-primary   hover:bg-dark-2 `}
            labelProps={"f-18 leading-4 text-white font-bold"}
            label="Confirm"
            type="submit"
            id="sendForm"
          />
        </div>
      </div>
    </>
    // )
  );
};

export default BraintreeCustomForm;
