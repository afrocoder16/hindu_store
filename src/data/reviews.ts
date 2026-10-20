export interface Review {
  name: string;
  text: string;
}

// Picked from the store's Google reviews. Each quote is the reviewer's own words.
export const reviews: Review[] = [
  {
    name: 'Jacob Hart',
    text: 'Omar and the family do a great job of customer service and family feel. He makes everyone feel like family, and the food is excellent! Best Rice in town, and I’m a big fan of the goat!',
  },
  {
    name: 'Andrew Naseth',
    text: 'The chicken and rice is best meal you can buy in Marshall!',
  },
  {
    name: 'kitty',
    text: 'Food was delicious and the service was amazing! Super kind and such low prices, definitely recommending!',
  },
  {
    name: 'Jared Schmidt',
    text: 'I had the gyro sandwich and a couple sambusas (1 chicken, 1 beef). Very good and large portions for the price.',
  },
  {
    name: 'Shelly Brooks',
    text: 'This place is so good! The chicken and rice is awesome, but everything I order always is. They are so friendly and helpful.',
  },
  {
    name: 'Sam Jens',
    text: 'The food was amazing! The owners were great to work with. They provided warmers along with the food and went above and beyond to help make our event wonderful.',
  },
];
