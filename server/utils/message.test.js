const chai = require('chai');
const expect = chai.expect;

const { generateMessage } = require('./message');

describe('Generate Message', () => {
    it("should generate correct message object", () => {
        let from = "WDJ",
            text = "some random text";
        let message = generateMessage(from, text);

        expect(message).to.have.property('createdAt').that.is.a('number');
        expect(message).to.have.property('from', from);
        expect(message).to.have.property('text', text);
    });
});
