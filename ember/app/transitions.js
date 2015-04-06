export default function(){
  this.transition(
    this.fromRoute(['posts.index', 'index']),
    this.toRoute('posts.show'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
