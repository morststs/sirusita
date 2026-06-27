export namespace main {
	
	export class Note {
	    id: string;
	    title: string;
	    tags: string[];
	    created: string;
	    modified: string;
	    body: string;
	
	    static createFrom(source: any = {}) {
	        return new Note(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.tags = source["tags"];
	        this.created = source["created"];
	        this.modified = source["modified"];
	        this.body = source["body"];
	    }
	}
	export class NoteMeta {
	    id: string;
	    title: string;
	    tags: string[];
	    created: string;
	    modified: string;
	
	    static createFrom(source: any = {}) {
	        return new NoteMeta(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.tags = source["tags"];
	        this.created = source["created"];
	        this.modified = source["modified"];
	    }
	}

}

