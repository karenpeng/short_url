var React = require('react')
var request = require('superagent')
var isUrl = require('valid-url').is_http_uri
var InputBox = require('./InputBox.jsx')

var protectUrl =  'http://' + location.host + '/'
var protectRegex = new RegExp(protectUrl, 'g')

var UrlBox = React.createClass({
  PropTypes:{
    postUrl: React.PropTypes.string.isRequired
  },
  getInitialState: function(){
    return{
      shortUrl: '',
      errorMsg: '',
      result: ''
    }
  },
  handleTyping: function(){
    this.setState({
      shortUrl: '',
      errorMsg: '',
      result: ''
    })
  },
  handleSubmit: function(data){
      //check url validation in frontend
      if(!isUrl(data) || data.match(protectRegex)) {
        this.setState({
          errorMsg: 'Unable to shorten invalid url. ಠ~ಠ',
          shortUrl: '',
          result: 'form-group has-error has-feedback'
        })
        return
      }
      this.sendUrlToServer(data)
  },
  sendUrlToServer: function(longURL){
      request
    .post(this.props.postUrl)
    .send(JSON.stringify({
          data: longURL
        }))
    .set('Content-Type', 'application/json')
    .end(function(err, res){
      if(err){
        console.log(err)
        this.setState({
          errorMsg: 'Unable to shorten invalid url. ಠ~ಠ',
          shortUrl: '',
          result: 'form-group has-error has-feedback'
        })
        return
      }
      this.setState({
        shortUrl: 'http://' + location.host + '/' + res.body.short,
        errorMsg: '',
        result: 'form-group has-success has-feedback'
      })
    }.bind(this))

  },
  // componentDidMount: function () {
  //   this.sendUrlToServer()
  // },
  render: function(){
    return(
      <div className={this.state.result}>
         <InputBox
           submit={this.handleSubmit} typing={this.handleTyping}
           shortUrl={this.state.shortUrl} errorMsg={this.state.errorMsg}>
         </InputBox>
      </div>
    )
  }
})

module.exports = UrlBox