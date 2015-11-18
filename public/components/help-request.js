(function() {
  var _formData = {
    author: 'William Carroll',
    content: '',
    tags: [],
    timesubmitted: '',
    accepted: false,
    closed: false,
    assignedFellow: 'no fellow assigned'
  };

  var HelpRequestTab = React.createClass({
    sendRequest: function(e) {
      e.preventDefault();
      _formData.content = this.refs.content.value.trim()
      _formData.timesubmitted = new Date();
      $.post('/', _formData, function(data) {
        console.log('successfully posted! data: ' + JSON.stringify(data));
      });
    },
    render: function() {
      return (
        <div className="help">
        <div className='help-text'>Help</div>
          <textarea ref="content" className="request-text form-control" rows="3" id="content" placeholder="What do you need help on?"></textarea>
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
        <input type="submit" id='input-submit' value="Add Tags" />
      </form> 
      <RenderTags data={this.state.inputData} />
      </div>
      );
    }
  });

  var RenderTags = React.createClass({
    closeTag: function (e) {
      $(e.target).closest('div').remove();
      //remove from the database as well
    },
    render: function () {
      var tagNodes = this.props.data.map(function(tag, idx) {
        return (
          <div className='chip' onClick={this.closeTag} key={idx}>{tag.text}
            <i className='material-icons'>close</i>
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
