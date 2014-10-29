import trim from 'patterns/numbers/trim';

export default function (user) {
  var position = user.body.GetPosition();
  return [user.id, trim(position.get_x()), trim(position.get_y())];
}
