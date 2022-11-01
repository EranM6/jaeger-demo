const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');

const product = {
    prodNum: { type: Number },
    statusInt: { type: Number },
    status: { type: String, enum: ['SUBSCRIBED', 'FROZEN', 'STOPPED'] },
    isTrial: { type: Boolean },
    startDate: { type: Date },
    endDate: { type: Date },
    debtActive: { type: Boolean },
    debtAmount: { type: Double },
    cardExpiration: { type: Date },
    futureEndDate: { type: Date },
    endReasonCode: { type: Number },
    frozenPrint: {
        type: {
            freezeStatus: { type: Boolean },
            toDate: { type: Date }
        }
    },
    saleCode: { type: Number },
    promotionNum: { type: Number },
    proposalType: { type: Number },
    connectionType: { type: Number },
    payersSon: { type: Boolean },
    proposalPeriod: { type: Number },
    finishStageDate: { type: Date },
    isFinishStageDate: { type: Boolean },
    payProp: { type: Number },
    comboCode: { type: Number },
    abuse: {
        type: [{
            anonymousId: { type: String },
            updateDate: { type: Date },
        }]
    },
};

const Schema = mongoose.Schema({
    _id: { type: String, required: true },
    uIl: { type: Double },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    userMail: { type: String, required: true, index: true },
    updateDate: { type: Date, default: new Date() },
    ticket: { type: String },
    ticketExpiration: { type: Date },
    antiAbuseToken: { type: String },
    isAbuser: { type: Boolean },
    mobilePhone: {
        type: {
            phonePrefix: { type: Number },
            phoneSuffix: { type: Number },
            userMobile: { type: String }
        },
    },
    registerBrand: { type: String, enum: ['HTZ', 'TM', 'HDC'] },
    registerDate: { type: Date },
    registerOrigin: { type: String },
    miniRegStatus: { type: Boolean },
    isPhoneEmailConn: { type: Boolean },
    mailValidationDate: { type: Date },
    mobileValidationDate: { type: Date },
    termsAgreement: {
        type: {
            HTZ: { type: Date },
            TM: { type: Date },
            HDC: { type: Date },
        }
    },
    GDPR: {
        type: [{
            brand: { type: String },
            cookieConsentType: { type: String },
            cookieConsentDate: { type: Date },
        }]
    },
    specialOffers: {
        type: [{
            specialOffer: { type: String },
            specialOfferDate: { type: Date },
        }]
    },
    subsNo: { type: Number },
    products: { type: [product] },
    readerId: { type: [String], index: true }
}, {
    query:{
        byId(id){
            return this.where({ _id: id })
        }
    }
});

module.exports = Schema;