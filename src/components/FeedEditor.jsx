import React from 'react'
import PropTypes from 'prop-types'
import feeds from '../redux/modules/feeds'

class FeedEditor extends React.PureComponent {
  static propTypes = {
    feed: PropTypes.object.isRequired,
    onRename: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleKey = this.handleKey.bind(this)
  }

  componentDidMount() {
    this.input.select()
  }

  render() {
    const title = feeds.selectors.getFeedTitle(this.props.feed)

    return (
      <input
        defaultValue={title}
        ref={el => this.input = el}
        onBlur={this.handleSubmit}
        onKeyUp={this.handleKey}
      />
    )
  }

  handleSubmit() {
    const onRename = this.props.onRename
    if (!onRename) return

    onRename(this.props.feed, this.input.value)
  }

  handleKey(event) {
    if (event.keyCode === 13) {
      this.handleSubmit()
    } else if (event.keyCode === 27) {
      const title = feeds.selectors.getFeedTitle(this.props.feed)
      this.input.value = title
      this.input.blur()
    }
  }
}

export default FeedEditor