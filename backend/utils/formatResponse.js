function formatDoc(doc) {
  if (!doc) return null;

  const obj = doc.toObject ? doc.toObject({ virtuals: true }) : { ...doc };

  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }

  delete obj.__v;

  if (Array.isArray(obj.orderedProducts)) {
    obj.orderedProducts = obj.orderedProducts.map((item) => {
      const formatted = { ...item };
      if (formatted.productId && typeof formatted.productId === 'object') {
        formatted.productId = formatted.productId.toString();
      } else if (formatted.productId) {
        formatted.productId = formatted.productId.toString();
      }
      return formatted;
    });
  }

  if (obj.customerId && typeof obj.customerId === 'object' && obj.customerId._id) {
    obj.customerId = obj.customerId._id.toString();
  }

  if (obj.productId && typeof obj.productId === 'object' && obj.productId._id) {
    obj.productId = obj.productId._id.toString();
  }

  if (obj.orderId && typeof obj.orderId === 'object' && obj.orderId._id) {
    obj.orderId = obj.orderId._id.toString();
  }

  return obj;
}

function formatDocs(docs) {
  return docs.map(formatDoc);
}

module.exports = { formatDoc, formatDocs };
