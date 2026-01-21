"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  function PaymentBox({
    label,
    active = false,
  }: {
    label: string
    active?: boolean
  }) {
    return (
      <div
        className={`flex items-center justify-center h-20 rounded-xl border text-sm font-medium cursor-default
        ${active
            ? "border-yellow-400 bg-yellow-50 text-gray-900"
            : "border-gray-200 bg-gray-100 text-gray-700"
          }
      `}
      >
        {label}
      </div>
    )
  }


  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Application & Payment Process</h1>

      {/* Step Indicator */}
      <div className="flex justify-between mb-6">
        {["Create", "Deposit", "Payment Method"].map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step === index + 1
                ? "bg-blue-500"
                : index + 1 < step
                  ? "bg-green-500"
                  : "bg-gray-300"
                }`}
            >
              {index + 1}
            </div>
            <span className="text-sm mt-1">{label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {step === 1 && "Step 1: Interview Form"}
            {step === 2 && "Step 2: Deposit"}
            {step === 3 && "Step 3: Select Payment Method"}
            {/* {step === 4 && "Step 4: Success"} */}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Step 1: Static Interview Form */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Full Name</label>
                <input
                  placeholder="Your full name"
                  className="border rounded p-2 w-full bg-gray-100"
                  type="text"
                />
              </div>

              <div>
                <label className="block font-medium">Email</label>
                <input
                  placeholder="Your email"
                  className="border rounded p-2 w-full bg-gray-100"
                  type="text"
                />
              </div>

              <div>
                <label className="block font-medium">Phone</label>
                <input
                  placeholder="Your phone number"
                  className="border rounded p-2 w-full bg-gray-100"
                  type="text"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">CV Form</label>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full cursor-pointer rounded border border-gray-300 bg-gray-100 p-2 text-sm
               file:mr-4 file:rounded file:border-0
               file:bg-primary file:px-4 file:py-2
               file:text-sm file:font-medium file:text-white
               hover:file:bg-gray-800"
                />
              </div>


              {/* <div>
                <label className="block font-medium">Cover Letter</label>
                <textarea
                  placeholder="Short cover letter"
                  className="border rounded p-2 w-full bg-gray-100"
                  disabled
                />
              </div> */}

              <Button onClick={nextStep} className="w-full">
                Next: Deposit
              </Button>
            </div>
          )}

          {/* Step 2: Deposit */}
          {step === 2 && (
            <div className="space-y-4">
              <p>Deposit your payment here. Enter amount and confirm.</p>
              <input
                type="number"
                placeholder="Enter amount"
                className="border rounded p-2 w-full"
                defaultValue={"50000"}
                disabled
              />
              <Badge variant="secondary">Simulated Payment</Badge>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">

                {/* LEFT: Payment Methods */}
                <div className="md:col-span-2 p-6 space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Select a payment method
                  </h2>

                  {/* Easy Payment */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-500">
                      Easy Payment
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      <PaymentBox label="KakaoPay" active />
                      <PaymentBox label="SSG Pay" />
                      <PaymentBox label="Payco" />
                    </div>
                  </div>

                  {/* Credit / Debit Card */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-500">
                      Credit / Debit Card
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      <PaymentBox label="Shinhan" />
                      <PaymentBox label="Hana Pay" />
                    </div>
                  </div>
                </div>

                {/* RIGHT: Summary */}
                <div className="bg-gray-50 p-6 space-y-6 border-l">
                  <div>
                    <p className="text-sm text-gray-500">Product</p>
                    <p className="font-medium text-gray-800">
                      Wallet Deposit
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {/* ₩1,000 */}
                      <span className="text-sm text-gray-700">KWR</span>  50,000
                    </p>
                  </div>

                  <div className="mt-auto">
                    <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
                      Test payment – no real charge
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation Buttons */}
        {step > 1 && step < 3 && (
          <div className="flex justify-between p-4">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep} className="ml-auto">
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
