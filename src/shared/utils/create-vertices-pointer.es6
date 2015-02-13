import b2 from 'box2d';

export default vertices => {
  let ptr = b2.allocate(vertices.length * 8, 'float', b2.ALLOC_STACK);
  for (let i = 0, l = vertices.length; i < l; ++i) {
    let vertex = vertices[i];
    b2.setValue(ptr + (i * 8), vertex.x, 'float');
    b2.setValue(ptr + (i * 8) + 4, vertex.y, 'float');
  }
  return b2.wrapPointer(ptr, b2.b2Vec2);
};
