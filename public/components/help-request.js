(function() {

  var _formData = {
    author: 'William Carroll',
    content: '',
    tags: [],
    timesubmitted: '',
    timeclosed: '',
    accepted: false,
    closed: false,
    assignedFellow: 'no fellow assigned',
    feedback: 'empty'
  };

  var Tag = React.createClass({
    removeSelf: function(e) {
      this.props.parentRemoveTag(this.refs.tagText.innerHTML);
    },
    render: function() {
      return (
        <div className="chip" tagName={ this.props.text } onClick={ this.removeSelf }>
          <span ref="tagText">{ this.props.text }</span><i className='material-icons'>close</i>
        </div>
      );
    }
  });

  var TagContainer = React.createClass({
    render: function () {
      var tagNodes = this.props.data.map(function(tag, idx) {
        return (
            <Tag text={ tag } parentRemoveTag={ this.props.parentRemoveTag } key={ idx } />
          );
      }.bind(this))
      return (
        <div className="taglist">
          { tagNodes }
        </div>
      );
    }
  });

  var TagSubmit = React.createClass({
    getInitialState: function() {
      return {
        inputTags: [],
      };
    },
    clearForms: function() {
      this.refs.tag.value = '';
    },
    parentRemoveTag: function(tagText) {
      var inputTags = this.state.inputTags.slice();
      var tagIdx = inputTags.indexOf(tagText);
      inputTags.splice(tagIdx, 1)
      this.setState({
        inputTags: inputTags
      });
    },
    handleSubmit: function (e) {
      e.preventDefault();
      var tagText = this.refs.tag.value.trim();
      _formData.tags.push(tagText);
      this.setState({
        inputTags: this.state.inputTags.concat(tagText)
      });
      this.clearForms();
    },
    render: function () {
      return (
      <div className='submit-tags'>
        <form className="submit-tag" onSubmit={this.handleSubmit} >
          <input type="text" id='input' autoComplete="off" placeholder="Enter tags" ref="tag"/>
          <input type="submit" id='input-submit' value="Add Tags" />
        </form> 
        <TagContainer data={ this.state.inputTags } parentRemoveTag={ this.parentRemoveTag } />
      </div>
      );
    }
  });

  var HelpRequestTab = React.createClass({
    clearForm: function() {
      this.refs.content.value = '';
    },
    sendRequest: function(e) {
      e.preventDefault();
      _formData.content = this.refs.content.value.trim()
      _formData.timesubmitted = new Date();
      $.post('/', _formData, function(data) {
        console.log('successfully posted! data: ' + JSON.stringify(data));
        this.clearForm();
      }.bind(this));
    },
    render: function() {
      return (
        <div className="help">
        <div className='help-text'>Help</div>
          <textarea ref="content" className="request-text form-control" rows="3" id="content" placeholder="What do you need help on?"></textarea>
          <TagSubmit /><br/>
          <button id='request-submit' onClick={this.sendRequest}>Submit Help Request</button>
        </div>
      );
    }
  });

  ReactDOM.render(
    <HelpRequestTab className='help-request' />, document.getElementById('help-request')
  );
})();
