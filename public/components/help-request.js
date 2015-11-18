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
          <textarea ref="content" className="request-text form-control" rows="3" id="content" placeholder="Input your question here"></textarea>
          <SubmitTags /><br/>
          <button id='request-submit' onClick={this.sendRequest}>Submit Help Request</button>
        </div>
      );
    }
  });

  var SubmitTags = React.createClass({
    getInitialState: function() {
      return {
        inputData: [],
      };
    },
    removeTag: function(tagname) {
      var removeIdx = this.state.inputData.indexOf(tagname);
      var cp = this.state.inputData.slice();
      cp.splice(removeIdx, 1);
      this.setState({
        inputData: cp
      });
    },
    handleSubmit: function (event) {
      event.preventDefault();
      console.log('pushing');

      this.state.inputData.push({key:this.refs.tag.value.trim(), text: this.refs.tag.value.trim()});
      _formData.tags.push(this.refs.tag.value.trim());
      console.log('formData is: ' + _formData);
      this.setState({
        inputData: this.state.inputData
      });

      console.log(this.state.inputData)
      this.refs.tag.value = '';
    },
    render: function () {
      return (
        <div className='submit-tags'>
          <form className="submit-tag" onSubmit={this.handleSubmit} >
            <input type="text" id='input' autoComplete="on" placeholder="Enter tags" ref="tag"/>
            <input type="submit" value="Add Tags" />
          </form> 
          <RenderTags data={this.state.inputData} updateParentState = { this.removeTag } />
        </div>
      );
    }
  });

  var RenderTags = React.createClass({
    closeTag: function (e) {
      var tag = $(e.target).closest('div').find('span').text();
      this.props.updateParentState(tag);
      $(e.target).closest('div').remove();
    },
    render: function () {
      var tagNodes = this.props.data.map(function(tag, idx) {
        return (
          <div className='chip' tagName={ tag.text } onClick={this.closeTag} key={idx}>
            <span>{tag.text}</span><i className='material-icons'>close</i>
          </div>
          );
      }.bind(this))
      return (
        <div className="taglist">{tagNodes}</div>
      );
    }
  });

  ReactDOM.render(
    <HelpRequestTab className='help-request' />, document.getElementById('help-request')
  );
})();
