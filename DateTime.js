/**
 * Ext JS form datetime field
 *
 * Ext JS 4.2.1
 */
Ext.define('Ext.ux.form.field.DateTime', {
	extend: 'Ext.form.FieldContainer',
	alias: ['widget.datetimefield', 'widget.timedatefield'],

	requires: [
		'Ext.form.field.Date',
		'Ext.form.field.Time',
		'Ext.layout.container.HBox'
	],
	
	mixins: {
		field: 'Ext.form.field.Field'
	},
	
	format: 'd.m.Y H:i',
	dateFormat: 'd.m.Y',
	timeFormat: 'H:i',
	
	layout: 'hbox',

	initComponent: function() {
		var me = this,
			dateConfig,
			timeConfig,
			i = 0;
		
		dateConfig = Ext.apply({
			format: me.dateFormat,
			flex: 3,
			isFormField: false
		}, me.dateConfig);
		
		timeConfig = Ext.apply({
			format: me.timeFormat,
			flex: 2,
			margin: '0 0 0 5',
			isFormField: false
		}, me.timeConfig);
		
		me.dateField = Ext.widget('datefield', dateConfig);
		me.timeField = Ext.widget('timefield', timeConfig);

		me.items = [
			me.dateField, 
			me.timeField
		];
		
		for (; i < me.items.length; i++) {
			me.items[i].on({
				blur: me.onItemBlur,
				focus: me.onItemFocus,
				
				scope: me
			});
		}

		me.callParent();
		
		me.initField();
		
		me.on('show', function() {
			console.log('show');
		});
	},
	
	getFocusEl: function() {
		return this.dateField;
	},
	
	onItemBlur: function() {
		this.onBlur();
	},
	
	cancelBlur: function() {
		var task = this.blurTask;
		
		if (task) {
			task.cancel();
		}
	},
	
	onItemFocus: function(item) {
		var me = this;
		
		me.suspendEvent('blur');
		setTimeout(function() {
			me.resumeEvent('blur');
		}, 10);
		
		this.onFocus();
	},
	
	initValue: function() {
		var me = this,
			valueCfg = me.value;
			
		me.originalValue = me.lastValue = valueCfg || me.getValue();
		
		if (valueCfg) {
			me.setValue(valueCfg);
		}
	},

	getValue: function() {
		var me = this,
			value = null,
			date, 
			time;
		
		date = me.dateField.getValue(value);
		time = me.timeField.getValue(value);
		
		if (Ext.isDate(date) && Ext.isDate(time)) {
			value = date;
			
			value.setHours(time.getHours());
			value.setMinutes(time.getMinutes());
			value.setSeconds(time.getSeconds());
			value.setMilliseconds(time.getMilliseconds());
		}
		
		return value;
	},

	setValue: function(value) {
		var me = this,
			date, 
			time;
		
		if (!Ext.isDate(value)) {
			date = me.parseDate(value, me.dateFormat);
			time = me.parseDate(value, me.timeFormat);
		}
		
		me.dateField.setValue(date || value);
		me.timeField.setValue(time || value);
			
		return me;
	},
	
	rawToValue: function(rawValue) {
		return this.parseDate(rawValue) || rawValue || null;
	},
	
	valueToRaw: function(value) {
		return this.formatDate(this.parseDate(value));
	},
	
	safeParse: function(value, format) {
		var me = this,
			utilDate = Ext.Date,
			result = null;

		result = utilDate.parse(value, format, true);
		
		return result;
	},
	
	parseDate: function(value, format) {
		if(!value || Ext.isDate(value)) {
			return value;
		}

		var me = this,
			val = me.safeParse(value, format || me.format);
		
		return val;
	},

	formatDate: function(date){
		return Ext.isDate(date) ? Ext.Date.dateFormat(date, this.format) : date;
	},
	
	onDestroy: function() {
		var me = this;
		
		delete me.dateField;
		delete me.timeField;
		
		me.callParent();
	}
});
